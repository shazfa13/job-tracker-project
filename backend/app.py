from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient, errors
from bson.objectid import ObjectId
import os

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["jobtracker"]
users_col = db["users"]
jobs_col = db["jobs"]

# Ensure indexes
users_col.create_index("username", unique=True)
jobs_col.create_index("user_id")

# -------------------------
# HELPERS
# -------------------------
def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "role": user.get("role", "client")
    }


def serialize_job(job):
    return {
        "id": str(job["_id"]),
        "user_id": str(job["user_id"]),
        "company": job.get("company", ""),
        "role": job.get("role", ""),
        "status": job.get("status", ""),
        "notes": job.get("notes", "")
    }


def to_objectid(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return None


# -------------------------
# SIGNUP
# -------------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role = data.get("role", "client")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        users_col.insert_one({"username": username, "password": password, "role": role})
        return jsonify({"message": "User created"})
    except errors.DuplicateKeyError:
        return jsonify({"error": "User already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------
# LOGIN
# -------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = users_col.find_one({"username": username, "password": password})
    if user:
        return jsonify({"message": "Login successful", "role": user.get("role", "client"), "user_id": str(user["_id"])})
    else:
        return jsonify({"error": "Invalid credentials"}), 401


# -------------------------
# ADD JOB
# -------------------------
@app.route("/jobs", methods=["POST"])
def add_job():
    data = request.json
    user_id = data.get("user_id")
    company = data.get("company")
    job_role = data.get("role")
    status = data.get("status")

    if not user_id or not company or not job_role or not status:
        return jsonify({"error": "Missing required fields"}), 400

    user_obj_id = to_objectid(user_id)
    if not user_obj_id:
        return jsonify({"error": "Invalid user_id"}), 400

    job_doc = {
        "user_id": user_obj_id,
        "company": company,
        "role": job_role,
        "status": status,
        "notes": data.get("notes", "")
    }

    result = jobs_col.insert_one(job_doc)
    return jsonify({"message": "Job added", "id": str(result.inserted_id)})


# -------------------------
# GET JOBS
# -------------------------
@app.route("/jobs", methods=["GET"])
def get_jobs():
    user_id = request.args.get("user_id")
    user_role = request.args.get("role", "client")

    if user_role == "admin":
        jobs = jobs_col.find()
    else:
        user_obj_id = to_objectid(user_id)
        if not user_obj_id:
            return jsonify({"error": "Invalid user_id"}), 400
        jobs = jobs_col.find({"user_id": user_obj_id})

    return jsonify([serialize_job(job) for job in jobs])


# -------------------------
# UPDATE JOB
# -------------------------
@app.route("/jobs/<job_id>", methods=["PUT"])
def update_job(job_id):
    data = request.json
    user_id = data.get("user_id")
    user_role = data.get("user_role", "client")
    company = data.get("company")
    job_role = data.get("job_role")
    status = data.get("status")

    if not user_id or not company or not job_role or not status:
        return jsonify({"error": "Missing required fields"}), 400

    job_obj_id = to_objectid(job_id)
    user_obj_id = to_objectid(user_id)
    if not job_obj_id or not user_obj_id:
        return jsonify({"error": "Invalid id"}), 400

    job = jobs_col.find_one({"_id": job_obj_id})
    if not job:
        return jsonify({"error": "Job not found"}), 404

    if user_role != "admin" and job.get("user_id") != user_obj_id:
        return jsonify({"error": "Unauthorized"}), 403

    jobs_col.update_one({"_id": job_obj_id}, {"$set": {"company": company, "role": job_role, "status": status}})
    return jsonify({"message": "Job updated"})


# -------------------------
# DELETE JOB
# -------------------------
@app.route("/jobs/<job_id>", methods=["DELETE"])
def delete_job(job_id):
    user_id = request.args.get("user_id")
    user_role = request.args.get("role", "client")

    job_obj_id = to_objectid(job_id)
    user_obj_id = to_objectid(user_id)

    if not job_obj_id or (user_role != "admin" and not user_obj_id):
        return jsonify({"error": "Invalid id"}), 400

    job = jobs_col.find_one({"_id": job_obj_id})
    if not job:
        return jsonify({"error": "Job not found"}), 404

    if user_role != "admin" and job.get("user_id") != user_obj_id:
        return jsonify({"error": "Unauthorized"}), 403

    jobs_col.delete_one({"_id": job_obj_id})
    return jsonify({"message": "Deleted"})


# -------------------------
# JOB NOTES
# -------------------------
@app.route("/jobs/<job_id>/notes", methods=["GET"])
def get_job_notes(job_id):
    user_id = request.args.get("user_id")
    user_role = request.args.get("role", "client")

    job_obj_id = to_objectid(job_id)
    user_obj_id = to_objectid(user_id)
    if not job_obj_id:
        return jsonify({"error": "Invalid job id"}), 400

    job = jobs_col.find_one({"_id": job_obj_id})
    if not job:
        return jsonify({"error": "Job not found"}), 404

    if user_role != "admin" and job.get("user_id") != user_obj_id:
        return jsonify({"error": "Unauthorized"}), 403

    notes = job.get("notes", "")
    return jsonify({"notes": notes})


@app.route("/jobs/<job_id>/notes", methods=["POST"])
def update_job_notes(job_id):
    data = request.json
    user_id = data.get("user_id")
    user_role = data.get("role", "client")
    notes = data.get("notes", "")

    job_obj_id = to_objectid(job_id)
    user_obj_id = to_objectid(user_id)
    if not job_obj_id:
        return jsonify({"error": "Invalid job id"}), 400

    job = jobs_col.find_one({"_id": job_obj_id})
    if not job:
        return jsonify({"error": "Job not found"}), 404

    if user_role != "admin" and job.get("user_id") != user_obj_id:
        return jsonify({"error": "Unauthorized"}), 403

    jobs_col.update_one({"_id": job_obj_id}, {"$set": {"notes": notes}})
    return jsonify({"message": "Notes updated"})


# -------------------------
# RESET DATABASE (FOR DEVELOPMENT ONLY)
# -------------------------
@app.route("/reset-db", methods=["POST"])
def reset_db():
    users_col.delete_many({})
    jobs_col.delete_many({})
    return jsonify({"message": "Database reset successfully"})


# -------------------------
# ADMIN ENDPOINTS
# -------------------------
@app.route("/admin/jobs", methods=["GET"])
def admin_get_jobs():
    user_role = request.args.get("role", "client")
    if user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    jobs = jobs_col.find()
    return jsonify([serialize_job(job) for job in jobs])


@app.route("/admin/clients", methods=["GET"])
def admin_get_clients():
    user_role = request.args.get("role", "client")
    if user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    clients = users_col.find({"role": "client"}, {"password": 0})
    return jsonify([serialize_user(client) for client in clients])


@app.route("/admin/clients/<client_id>", methods=["DELETE"])
def admin_delete_client(client_id):
    user_role = request.args.get("role", "client")
    if user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    client_obj_id = to_objectid(client_id)
    if not client_obj_id:
        return jsonify({"error": "Invalid client id"}), 400

    jobs_col.delete_many({"user_id": client_obj_id})
    users_col.delete_one({"_id": client_obj_id})
    return jsonify({"message": "Client deleted successfully"})


@app.route("/admin/jobs/<job_id>", methods=["DELETE"])
def admin_delete_job(job_id):
    user_role = request.args.get("role", "client")
    if user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    job_obj_id = to_objectid(job_id)
    if not job_obj_id:
        return jsonify({"error": "Invalid job id"}), 400

    jobs_col.delete_one({"_id": job_obj_id})
    return jsonify({"message": "Job deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True)
