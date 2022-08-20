const sql = require("./db.js");

// constructor
const Task = function(task) {
    this.title = task.title;
    this.description = task.description;
    this.published = task.published;
};

Task.create = (newTask, result) => {
    sql.query("INSERT INTO tasks SET ?", newTask, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created task: ", { id: res.insertId, ...newTask });
        result(null, { id: res.insertId, ...newTask });
    });
};

Task.findById = (id, result) => {
    sql.query(`SELECT * FROM tasks WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found task: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Task with the id
        result({ kind: "not_found" }, null);
    });
};

Task.getAll = (title, result) => {
    let query = "SELECT * FROM tasks";

    if (title) {
        query += ` WHERE title LIKE '%${title}%'`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("tasks: ", res);
        result(null, res);
    });
};

Task.getAllPublished = result => {
    sql.query("SELECT * FROM tasks WHERE published=true", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("tasks: ", res);
        result(null, res);
    });
};

Task.updateById = (id, task, result) => {
    sql.query(
        "UPDATE tasks SET title = ?, description = ?, published = ? WHERE id = ?",
        [task.title, task.description, task.published, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Task with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated task: ", { id: id, ...task });
            result(null, { id: id, ...task });
        }
    );
};

Task.remove = (id, result) => {
    sql.query("DELETE FROM tasks WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Task with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted task with id: ", id);
        result(null, res);
    });
};

Task.removeAll = result => {
    sql.query("DELETE FROM tasks", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} tasks`);
        result(null, res);
    });
};

module.exports = Task;