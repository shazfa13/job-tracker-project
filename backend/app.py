from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# -------------------------
# DATABASE CONNECTION
# -------------------------
def get_db():
    conn = sqlite3.connect("jobs.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables"""
    conn = get_db()
    
    conn.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'client'
    )
    """)
    
    conn.execute("""
    CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        company TEXT,
        role TEXT,
        status TEXT,
        notes TEXT DEFAULT ''
    )
    """)
    
    conn.commit()
    conn.close()

# -------------------------
# CREATE TABLES
# -------------------------
init_db()


# -------------------------
# SIGNUP
# -------------------------
@app.route("/signup", methods=["POST"])
def signup():

    data = request.json
    username = data["username"]
    password = data["password"]
    role = data.get("role", "client")  # Default to client if not specified

    conn = get_db()

    try:
        conn.execute(
            "INSERT INTO users (username,password,role) VALUES (?,?,?)",
            (username,password,role)
        )
        conn.commit()
        conn.close()
        return jsonify({"message":"User created"})
    except Exception as e:
        conn.close()
        return jsonify({"error":"User already exists"}),400


# -------------------------
# LOGIN
# -------------------------
@app.route("/login", methods=["POST"])
def login():

    data = request.json
    username = data["username"]
    password = data["password"]

    conn = get_db()

    user = conn.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (username,password)
    ).fetchone()
    
    conn.close()

    if user:
        return jsonify({
            "message":"Login successful",
            "role": user["role"],
            "user_id": user["id"]
        })
    else:
        return jsonify({"error":"Invalid credentials"}),401


# -------------------------
# ADD JOB
# -------------------------
@app.route("/jobs", methods=["POST"])
def add_job():

    try:
        data = request.json
        user_id = data.get("user_id")
        company = data.get("company")
        role = data.get("role")
        status = data.get("status")

        # Validate inputs
        if not user_id or not company or not role or not status:
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db()

        conn.execute(
            "INSERT INTO jobs (user_id, company, role, status) VALUES (?,?,?,?)",
            (int(user_id), company, role, status)
        )

        conn.commit()
        conn.close()

        return jsonify({"message":"Job added"})
    except Exception as e:
        print(f"Error adding job: {str(e)}")  # Log to server console
        return jsonify({"error": str(e)}), 400


# -------------------------
# GET JOBS
# -------------------------
@app.route("/jobs", methods=["GET"])
def get_jobs():

    user_id = request.args.get('user_id')
    user_role = request.args.get('role', 'client')  # Default to client if not specified

    conn = get_db()

    if user_role == 'admin':
        # Admin sees all jobs
        jobs = conn.execute("SELECT * FROM jobs").fetchall()
    else:
        # Client sees only their jobs
        jobs = conn.execute("SELECT * FROM jobs WHERE user_id = ?", (user_id,)).fetchall()

    return jsonify([dict(job) for job in jobs])


# -------------------------
# UPDATE JOB (NEW)
# -------------------------
@app.route("/jobs/<int:id>", methods=["PUT"])
def update_job(id):

    data = request.json
    user_id = data["user_id"]
    user_role = data.get("user_role", "client")
    company = data["company"]
    job_role = data["job_role"]
    status = data["status"]

    conn = get_db()

    # Check if user owns this job or is admin
    if user_role != 'admin':
        job = conn.execute("SELECT user_id FROM jobs WHERE id = ?", (id,)).fetchone()
        if not job or job["user_id"] != int(user_id):
            return jsonify({"error": "Unauthorized"}), 403

    conn.execute(
        "UPDATE jobs SET company=?, role=?, status=? WHERE id=?",
        (company, job_role, status, id)
    )

    conn.commit()

    return jsonify({"message":"Job updated"})


# -------------------------
# DELETE JOB
# -------------------------
@app.route("/jobs/<int:id>", methods=["DELETE"])
def delete_job(id):

    user_id = request.args.get('user_id')
    user_role = request.args.get('role', 'client')

    conn = get_db()

    # Check if user owns this job or is admin
    if user_role != 'admin':
        job = conn.execute("SELECT user_id FROM jobs WHERE id = ?", (id,)).fetchone()
        if not job or job["user_id"] != int(user_id):
            return jsonify({"error": "Unauthorized"}), 403

    conn.execute(
        "DELETE FROM jobs WHERE id=?",
        (id,)
    )

    conn.commit()

    return jsonify({"message":"Deleted"})


# -------------------------
# JOB NOTES
# -------------------------
@app.route("/jobs/<int:id>/notes", methods=["GET"])
def get_job_notes(id):
    """Get notes for a specific job"""
    
    user_id = request.args.get('user_id')
    user_role = request.args.get('role', 'client')
    
    conn = get_db()
    
    # Check if user owns this job or is admin
    if user_role != 'admin':
        job = conn.execute("SELECT user_id FROM jobs WHERE id = ?", (id,)).fetchone()
        if not job or job["user_id"] != int(user_id):
            conn.close()
            return jsonify({"error": "Unauthorized"}), 403
    
    job = conn.execute("SELECT notes FROM jobs WHERE id = ?", (id,)).fetchone()
    conn.close()
    
    if job:
        return jsonify({"notes": job["notes"] or ""})
    else:
        return jsonify({"error": "Job not found"}), 404


@app.route("/jobs/<int:id>/notes", methods=["POST"])
def update_job_notes(id):
    """Update notes for a specific job"""
    
    data = request.json
    user_id = data.get('user_id')
    user_role = data.get('role', 'client')
    notes = data.get('notes', '')
    
    conn = get_db()
    
    # Check if user owns this job or is admin
    if user_role != 'admin':
        job = conn.execute("SELECT user_id FROM jobs WHERE id = ?", (id,)).fetchone()
        if not job or job["user_id"] != int(user_id):
            conn.close()
            return jsonify({"error": "Unauthorized"}), 403
    
    conn.execute("UPDATE jobs SET notes=? WHERE id=?", (notes, id))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Notes updated"})


# -------------------------
# RESET DATABASE (FOR DEVELOPMENT ONLY)
# -------------------------
@app.route("/reset-db", methods=["POST"])
def reset_db():

    # Close existing connection
    conn = get_db()
    conn.close()

    # Delete the database file
    import os
    if os.path.exists("jobs.db"):
        os.remove("jobs.db")

    # Recreate tables
    conn = get_db()

    conn.execute("""
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'client'
    )
    """)

    conn.execute("""
    CREATE TABLE jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        company TEXT,
        role TEXT,
        status TEXT,
        notes TEXT DEFAULT ''
    )
    """)

    conn.commit()
    conn.close()

    return jsonify({"message": "Database reset successfully"})


# -------------------------
# ADMIN ENDPOINTS
# -------------------------
@app.route("/admin/jobs", methods=["GET"])
def admin_get_jobs():
    """Admin gets all jobs from all users"""
    
    user_role = request.args.get('role', 'client')
    
    # Check if user is admin
    if user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    conn = get_db()
    jobs = conn.execute("SELECT * FROM jobs").fetchall()
    conn.close()
    
    return jsonify([dict(job) for job in jobs])


@app.route("/admin/clients", methods=["GET"])
def admin_get_clients():
    """Admin gets all clients"""
    
    user_role = request.args.get('role', 'client')
    
    # Check if user is admin
    if user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    conn = get_db()
    clients = conn.execute("SELECT id, username, role FROM users WHERE role='client'").fetchall()
    conn.close()
    
    return jsonify([dict(client) for client in clients])


@app.route("/admin/clients/<int:client_id>", methods=["DELETE"])
def admin_delete_client(client_id):
    """Admin deletes a client and all their jobs"""
    
    user_role = request.args.get('role', 'client')
    
    # Check if user is admin
    if user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    conn = get_db()
    
    # Delete all jobs for this client
    conn.execute("DELETE FROM jobs WHERE user_id=?", (client_id,))
    
    # Delete the client
    conn.execute("DELETE FROM users WHERE id=?", (client_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Client deleted successfully"})


@app.route("/admin/jobs/<int:job_id>", methods=["DELETE"])
def admin_delete_job(job_id):
    """Admin deletes any job"""
    
    user_role = request.args.get('role', 'client')
    
    # Check if user is admin
    if user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    conn = get_db()
    conn.execute("DELETE FROM jobs WHERE id=?", (job_id,))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Job deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True)
