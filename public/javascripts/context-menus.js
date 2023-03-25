// Hides context menus if clicked outside
const hideAllMenus = () => {
    $("#exercise-menu").hide().offset({ top: 0, left: 0 })
    $("#exercise-comments-menu").hide().offset({ top: 0, left: 0 })
    $("#weight-menu").hide().offset({ top: 0, left: 0 })
    $("#set-menu").hide().offset({ top: 0, left: 0 })
    $("#set-comments-menu").hide().offset({ top: 0, left: 0 })
    $("#superset-menu").hide().offset({ top: 0, left: 0 })
    $("#superset-reps-menu").hide().offset({ top: 0, left: 0 })
}
hideAllMenus()

document.addEventListener("click", (e) => {
    const allMenus = document.querySelectorAll(".context-menu")
    allMenus.forEach(menu => {
        if (e.target.offsetParent != menu) {
            hideAllMenus()
        }
    })
})

////////////////////////
//  Exercise options  //
////////////////////////

// New exercise name
const editExerciseName = (exercise_name, date) => {
    $("#exercise-edit").off()
    $("#exercise-edit").click(() => {
        hideAllMenus()

        let newName = prompt("New exercise name: ", exercise_name)
        if (newName != null && !newName.match(/^\s+$/) && newName != "" && newName != exercise_name) {
            xhttp.open("POST", "/update/exercise")
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
            xhttp.send(JSON.stringify({ exercise_name, newName, date }))
            xhttp.onload(() => {
                console.log("im here")
                renderWorkout(JSON.parse(this.response), true, date)
                toggleRequired()
                populate()
            })
        }
    })
}

const deleteExercise = (exercise_name, date) => {
    $("#exercise-delete").off()
    $("#exercise-delete").click(() => {
        if (confirm("Are you sure you want to delete this exercise?") == true) {
            xhttp.open("POST", "/delete/exercise")
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
            xhttp.send(JSON.stringify({ exercise_name, date }))
            xhttp.onload(() => {
                renderWorkout(JSON.parse(this.response), true, date)
                toggleRequired()
                populate()
            })
        }
    })
}

////////////////////////////////
//  Exercise comment options  //
////////////////////////////////

// Edit comment
const editExerciseComment = (exercise_name, date, index, comment) => {
    $("#exercise-comment-edit").off()
    $("#exercise-comment-edit").click(() => {
        hideAllMenus()

        let editedComment = prompt("New comment: ", comment)
        if (editedComment != null && !editedComment.match(/^\s+$/) && editedComment != "" && editedComment != comment) {
            xhttp.open("POST", "/update/exercise_comments")
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
            xhttp.send(JSON.stringify({ exercise_name, commentIndex: index, editedComment, date }))
            xhttp.onload(() => {
                renderWorkout(JSON.parse(this.response), true, date)
                toggleRequired()
                populate()
            })
        }
    })
}

const addExerciseComment = (exercise_name, date) => {
    $("#").off()
    $("#").click(() => {

    })
}

// Delete exercise comment
const deleteExerciseComment = (exercise_name, date,) => {
    $("#").off()
    $("#").click(() => {

    })
}

//////////////////////
//  Weight options  //
//////////////////////

// Edit weight
const editWeight = (exercise_name, date, set_id, set_weight) => {
    $("#weight-edit").off()
    $("#weight-edit").click(() => {
        hideAllMenus()

        let newWeight = prompt("New weight used: ", set_weight)
        if (newWeight != null && !newWeight.match(/^\s+$/) && newWeight != set_weight) {
            if (!newWeight.match(/(^(\d+\.\d{0,2}|\d+)(kg|lbs)$)|(^$)/)) {
                console.log(newWeight)
                alert("Make sure your new weight follows the structure [x]kg/lbs or [x.xx]kg/lbs.")
                return
            } else {
                xhttp.open("POST", "/update/weight")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, set_id, newWeight, date }))
                xhttp.onload(() => {
                    renderWorkout(JSON.parse(this.response), true, date)
                    toggleRequired()
                    populate()
                })
            }
        }
    })
}

// Delete weight
const deleteWeight = (exercise_name, date,) => {
    $("#").off()
    $("#").click(() => {

    })
}

///////////////////
//  Set options  //
///////////////////

// Edit reps
const editReps = (exercise_name, date, set_id, repsIndex, reps) => {
    $("#reps-edit").off()
    $("#reps-edit").click(() => {
        let newReps = prompt(`New reps count for set ${repsIndex + 1}: `, reps)
        if (newReps != null && !newReps.match(/^\s+$/) && newReps != "" && newReps != reps) {
            if (!newReps.match(/^\d+$/)) {
                alert("Please enter a valid number for reps performed.")
                return
            } else {
                xhttp.open("POST", "/update/reps")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, set_id, repsIndex, newReps, date }))
                xhttp.onload(() => {
                    renderWorkout(JSON.parse(this.response), true, date)
                    toggleRequired()
                    populate()
                })
            }
        }
    })
}

// Delete set
const deleteSet = (exercise_name, date,) => {
    $("#").off()
    $("#").click(() => {

    })
}

///////////////////////////
//  Set comment options  //
///////////////////////////

// Edit set comment
const editSetComment = (exercise_name, date, set_id, commentIndex, comment) => {
    $("#set-comment-edit").off()
    $("#set-comment-edit").click(() => {
        let setIndex = comment.split(": ")[0]
        let editedComment = prompt(`New comment for set ${setIndex.split(" ")[1]}: `, comment.split(": ")[1])
        if (editedComment != null && !editedComment.match(/^\s+$/) && editedComment != "" && editedComment != comment) {
            editedComment = `${setIndex}: ` + editedComment
            xhttp.open("POST", "/update/set_comments")
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
            xhttp.send(JSON.stringify({ exercise_name, set_id, commentIndex, editedComment, date }))

            xhttp.onload(() => {
                renderWorkout(JSON.parse(this.response), true, date)
                toggleRequired()
                populate()
            })
        }
    })
}

// New set comment
const newSetComment = (exercise_name, date,) => {
    $("#").off()
    $("#").click(() => {

    })
}

// Delete set comment
const deleteSetComment = (exercise_name, date,) => {
    $("#").off()
    $("#").click(() => {

    })
}

////////////////////////
//  Superset options  //
////////////////////////

// Edit superset exercise
const editSupersetExercise = (exercise_name, date, set_id, superset_exercise) => {
    $("#superset-exercise-edit").off()
    $("#superset-exercise-edit").click(() => {
        let newName = prompt("New superset exercise name: ", superset_exercise)
        if (newName != null && !newName.match(/^\s+$/) && newName != "" && newName != superset_exercise) {
            xhttp.open("POST", "/update/superset_name")
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
            xhttp.send(JSON.stringify({ exercise_name, set_id, newName, date }))
            xhttp.onload(() => {
                renderWorkout(JSON.parse(this.response), true, date)
                toggleRequired()
                populate()
            })
        }
    })
}

// Edit superset weight
const editSupersetWeight = (exercise_name, date, set_id, superset_weight) => {
    $("#superset-weight-edit").off()
    $("#superset-weight-edit").click(() => {
        let newWeight = prompt("New superset weight used: ", superset_weight)
        if (newWeight != null && !newWeight.match(/^\s+$/) && newWeight != superset_weight) {
            if (!newWeight.match(/(^(\d+\.\d{0,2}|\d+)(kg|lbs)$)|(^$)/)) {
                alert("Make sure your new weight follows the structure [x]kg/lbs or [x.xx]kg/lbs.")
                return
            } else {
                xhttp.open("POST", "/update/superset_weight")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, set_id, newWeight, date }))
                xhttp.onload(() => {
                    renderWorkout(JSON.parse(this.response), true, date)
                    toggleRequired()
                    populate()
                })
            }
        }
    })
}

// Delete superset
const deleteSuperset = (exercise_name, date,) => {
    $("#").off()
    $("#").click(() => {

    })
}

/////////////////////////////
//  Superset reps options  //
/////////////////////////////

// Edit superset reps
const editSupersetReps = (exercise_name, date, set_id, repsIndex, reps) => {
    $("#superset-reps-edit").off()
    $("#superset-reps-edit").click(() => {
        let newReps = prompt(`New superset reps count for set ${repsIndex + 1}: `, reps)
        if (newReps != null && !newReps.match(/^\s+$/) && newReps != "" && newReps != reps) {
            if (!newReps.match(/^\d+$/)) {
                alert("Please enter a valid number for reps performed.")
                return
            } else {
                xhttp.open("POST", "/update/superset_reps")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, set_id, repsIndex, newReps, date }))
                xhttp.onload(() => {
                    renderWorkout(JSON.parse(this.response), true, date)
                    toggleRequired()
                    populate()
                })
            }
        }
    })
}