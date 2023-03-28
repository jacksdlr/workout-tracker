const xhttp = new XMLHttpRequest()

const form = document.getElementById("exercise-form")
const workoutContainer = document.querySelector(".workout-exercises")
const workoutTitle = document.getElementById("workout-name")
const displayDate = document.getElementById("display-date")

const exerciseMenu = document.getElementById("exercise-menu")
const exerciseCommentsMenu = document.getElementById("exercise-comments-menu")
const weightMenu = document.getElementById("weight-menu")
const setMenu = document.getElementById("set-menu")
const supersetMenu = document.getElementById("superset-menu")
const supersetRepsMenu = document.getElementById("superset-reps-menu")
const setCommentsMenu = document.getElementById("set-comments-menu")

if (inputDate.value == "") {
    inputDate.value = new Date().toISOString().split("T")[0]
}

const submitRequest = (date, reset) => {
    xhttp.open("GET", "/workouts/" + date)
    xhttp.send()
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            if (this.response) {
                if (this.response.match(/^</)) {
                    renderWorkout("not found", true, date)
                } else {
                    //console.log(JSON.stringify(JSON.parse(this.response), null, 4))
                    renderWorkout(JSON.parse(this.response), reset, date)
                    toggleRequired()
                    populate()
                }
                
            } else {
                renderWorkout("not found", reset, date)
                toggleRequired()
                
            }
        }
        
    }
}

form.addEventListener("submit", () => {
    setTimeout(() => {
        // Get the date and submit a GET request to return the user's workout for that date
        submitRequest(inputDate.value, true)
    }, 250)
})

displayDate.addEventListener("change", () => {
    setTimeout(() => {
        submitRequest(displayDate.value, true)
    }, 250)
})

const renderWorkout = (data, reset, date) => {
    let notFound = document.getElementById("not-found")
    let dateToRemove = document.getElementById("date")
    if (date == "example") {
        workoutTitle.insertAdjacentHTML("beforeend", `<p id="date">Example date</p>`)
    } else {
        workoutTitle.insertAdjacentHTML("beforeend", `<p id="date">${new Date(date).toDateString().slice(0, -5)}</p>`)
        displayDate.value = date
    }
    if (notFound) {
        notFound.remove()
    }
    if (dateToRemove) {
        dateToRemove.remove()
    }
    if (data == "not found") {
        notFound = document.createElement("p")
        notFound.setAttribute("id", "not-found")
        notFound.textContent = "No workout exists for this date..."
        workoutContainer.appendChild(notFound)
        const existingContainers = workoutContainer.querySelectorAll(".exercise-container")
        existingContainers.forEach(container => container.remove())
        workoutContainer.appendChild(notFound)
        displayDate.value = date
        return
    }
    if (data.date != displayDate.value || reset == true) {
        console.log("i reset the workout container")
        const existingContainers = workoutContainer.querySelectorAll(".exercise-container")
        existingContainers.forEach(container => container.remove())
    }
    if (date != "example") {

    }
    data.exercises.forEach(exercise => {
        console.log(exercise._id)
        let exerciseContainer = document.getElementById(`J${exercise._id}`)
        console.log(exerciseContainer)
        if (!exerciseContainer) {
            console.log("making an exercise container")
            createExerciseContainer(exercise)
            addExerciseComments(exercise)
            createweightContainers(exercise)
        } else {
            console.log("editing an existing exercise container")
            addExerciseComments(exercise)
            createweightContainers(exercise)
        }
    })
    $(".set-weight-and-count").click(function () {
        $header = $(this)
        $content = $header.next()
        $content.slideToggle(500)
    })
    $(".superset-exercise-and-weight").click(function () {
        $header = $(this)
        $content = $header.next()
        $content.slideToggle(500)
    })
    mobileRender()
}

const createExerciseContainer = (exercise) => {
    exerciseContainer = document.createElement("div")
    exerciseContainer.classList.add("exercise-container")
    exerciseContainer.setAttribute("id", `J${exercise._id}`)
    workoutContainer.appendChild(exerciseContainer)

    if (exercise.comments != "") {
        let exerciseComments = document.createElement("div")
        exerciseComments.classList.add("exercise-comments")
        exerciseComments.setAttribute("id", `J${exercise._id}` + "-comments")
        exerciseContainer.appendChild(exerciseComments)
    }

    let exerciseName = document.createElement("h2")
    exerciseName.classList.add("exercise-name")
    exerciseName.setAttribute("id", `J${exercise._id}` + "-name")
    exerciseName.insertAdjacentText("afterbegin", exercise.exercise_name)
    // Right click opens a prompt to change the exercise name
    exerciseName.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        hideAllMenus()

        // Position custom context menu at cursor
        $("#exercise-menu").slideDown(200).offset({
            top: e.pageY,
            left: preventOutOfBounds(exerciseMenu, e.pageX)
        })

        // Custom right click menu to edit or delete exercise
        editExerciseName(exercise.exercise_name, displayDate.value)
        addExerciseComment(exercise.exercise_name, displayDate.value)
        deleteExercise(exercise.exercise_name, displayDate.value)
    })
    exerciseContainer.appendChild(exerciseName)
}

const addExerciseComments = (exercise) => {
    let exerciseComments = document.getElementById(`J${exercise._id}` + "-comments")
    if (exercise.comments != "") {
        let existingComments = exerciseComments.querySelectorAll("li")
        existingComments.forEach(comment => comment.remove())
        exercise.comments.forEach((comment, index) => {
            let exerciseComment = document.createElement("li")
            exerciseComment.textContent = comment
            exerciseComment.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                hideAllMenus()

                $("#exercise-comments-menu").slideDown(200).offset({
                    top: e.pageY,
                    left: preventOutOfBounds(exerciseCommentsMenu, e.pageX)
                })

                editExerciseComment(exercise.exercise_name, displayDate.value, index, comment)
                deleteExerciseComment(exercise.exercise_name, displayDate.value, comment)
            })
            exerciseComments.appendChild(exerciseComment)
        })
        document.getElementById(`J${exercise._id}` + "-name").insertAdjacentElement("afterend", exerciseComments)
    }
}

const createweightContainers = (exercise) => {
    exerciseContainer = document.getElementById(`J${exercise._id}`)
    exercise.sets.forEach(set => {
        let weightContainer = document.getElementById(set._id)
        if (!weightContainer) {
            weightContainer = document.createElement("div")
            weightContainer.classList.add("weight-container")
            weightContainer.setAttribute("id", set._id)
            exerciseContainer.appendChild(weightContainer)
            populateweightContainers(exercise, set, weightContainer)
        } else {
            weightContainer.remove()
            weightContainer = document.createElement("div")
            weightContainer.classList.add("weight-container")
            weightContainer.setAttribute("id", set._id)
            exerciseContainer.appendChild(weightContainer)
            populateweightContainers(exercise, set, weightContainer)
        }
    })

}

const populateweightContainers = (exercise, set, weightContainer) => {
    // Create the element that holds that set data
    let setWeightAndCount = document.createElement("div")
    setWeightAndCount.classList.add("set-weight-and-count")

    // Descructure all possible set variables
    let {
        set_weight,
        set_reps,
        superset_exercise,
        superset_weight,
        superset_reps,
        sets_count,
        _id
    } = set

    let setWeight = document.createElement("h3")
    setWeight.classList.add("set-weight")
    setWeight.textContent = set_weight
    setWeightAndCount.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        hideAllMenus()

        $("#weight-menu").slideDown(200).offset({
            top: e.pageY,
            left: preventOutOfBounds(weightMenu, e.pageX)
        })

        editWeight(exercise.exercise_name, displayDate.value, _id, set_weight)
        deleteWeight(exercise.exercise_name, displayDate.value, _id)
    })
    setWeightAndCount.appendChild(setWeight)

    let setCount = document.createElement("h3")
    setCount.classList.add("set-count")

    // Get the sets count so that grammar is correct when displaying set data
    if (sets_count == 1) {
        setCount.textContent = "1 set"
    } else if (sets_count > 1) {
        setCount.textContent = `${sets_count} sets`
    }
    setWeightAndCount.appendChild(setCount)

    let setDetails = document.createElement("div")
    setDetails.classList.add("set-details")

    if (set_reps != "") {
        let setReps = document.createElement("p")
        setReps.classList.add("set-reps")
        setReps.textContent = `Reps: `
        set_reps.forEach((reps, index) => {
            let setRep = document.createElement("p")
            setRep.classList.add("set-rep")

            setRep.textContent = reps

            setRep.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                hideAllMenus()

                $("#set-menu").slideDown(200).offset({
                    top: e.pageY,
                    left: preventOutOfBounds(setMenu, e.pageX)
                })

                editReps(exercise.exercise_name, displayDate.value, _id, index, reps)
                addSetComment(exercise.exercise_name, displayDate.value, _id, index)
                deleteReps(exercise.exercise_name, displayDate.value, set.comments, _id, index)
            })
            setReps.append(setRep)
            if (index != set_reps.length - 1) {
                setReps.insertAdjacentText("beforeend", ",")
            }

        })
        setDetails.appendChild(setReps)
    }

    weightContainer.appendChild(setWeightAndCount)
    weightContainer.appendChild(setDetails)

    if (superset_exercise) {
        let supersetText = document.createElement("p")
        supersetText.setAttribute("id", "superset-text")
        supersetText.textContent = "~ Superset with ~"
        setDetails.appendChild(supersetText)

        let supersetExerciseAndWeight = document.createElement("div")
        supersetExerciseAndWeight.classList.add("superset-exercise-and-weight")
        supersetExerciseAndWeight.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            hideAllMenus()

            $("#superset-menu").slideDown(200).offset({
                top: e.pageY,
                left: preventOutOfBounds(supersetMenu, e.pageX)
            })

            editSupersetExercise(exercise.exercise_name, displayDate.value, _id, superset_exercise)
            editSupersetWeight(exercise.exercise_name, displayDate.value, _id, superset_weight)
            deleteSuperset(exercise.exercise_name, displayDate.value, _id)
        })

        let supersetExercise = document.createElement("h4")
        supersetExercise.classList.add("superset-exercise")
        supersetExercise.textContent = superset_exercise
        supersetExerciseAndWeight.appendChild(supersetExercise)

        let supersetWeight = document.createElement("h4")
        supersetWeight.classList.add("superset-weight")
        supersetWeight.textContent = superset_weight

        supersetExerciseAndWeight.appendChild(supersetWeight)

        let supersetDetails = document.createElement("div")
        supersetDetails.classList.add("superset-details")

        let supersetReps = document.createElement("p")
        supersetReps.classList.add("superset-reps")
        supersetReps.textContent = `Reps: `
        superset_reps.forEach((reps, index) => {
            let supersetRep = document.createElement("p")
            supersetRep.classList.add("set-rep")

            supersetRep.textContent = reps

            supersetRep.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                hideAllMenus()

                $("#superset-reps-menu").slideDown(200).offset({
                    top: e.pageY,
                    left: preventOutOfBounds(supersetRepsMenu, e.pageX)
                })

                editSupersetReps(exercise.exercise_name, displayDate.value, _id, index, reps)
            })
            supersetReps.append(supersetRep)
            if (index != superset_reps.length - 1) {
                supersetReps.insertAdjacentText("beforeend", ",")
            }
        })
        supersetDetails.appendChild(supersetReps)

        setDetails.appendChild(supersetExerciseAndWeight)
        setDetails.appendChild(supersetDetails)
    }

    if (set.comments != "") {
        let setComments = document.createElement("ul")
        setComments.classList.add("set-comments")
        set.comments.forEach((comment, index) => {
            let newComment = document.createElement("li")
            newComment.textContent = comment
            newComment.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                hideAllMenus()

                $("#set-comments-menu").slideDown(200).offset({
                    top: e.pageY,
                    left: preventOutOfBounds(setCommentsMenu, e.pageX)
                })

                editSetComment(exercise.exercise_name, displayDate.value, _id, index, comment)
                deleteSetComment(exercise.exercise_name, displayDate.value, _id, comment)
            })
            setComments.appendChild(newComment)
        })
        setDetails.appendChild(setComments)
    }
}
console.log($(window).width())
console.log($(window).height())
const mobileRender = () => {
    if ($(window).width() < $(window).height()) {
        let existingCollapsers = document.querySelectorAll(".exercise-collapse")
        if (existingCollapsers.length == 0) {
            $(".exercise-name").click(function () {
                $header = $(this)
                $content = $header.nextAll()
                $chevron = $header.children(".exercise-collapse")
                if (!$content.is(":visible")) {
                    $({ deg: -90 }).animate({ deg: 0 }, {
                        duration: 500,
                        step: (now) => {
                            $chevron.css({
                                transform: "rotate(" + now + "deg)"
                            })
                        }
                    })
                } else {
                    $({ deg: 0 }).animate({ deg: -90 }, {
                        duration: 500,
                        step: (now) => {
                            $chevron.css({
                                transform: "rotate(" + now + "deg)"
                            })
                        }
                    })
                }
                $content.slideToggle(500)
            })
            let exerciseContainers = document.querySelectorAll(".exercise-container")
            exerciseContainers.forEach(container => {
                container.firstChild.insertAdjacentHTML("beforeend", "<i class='fa-solid fa-chevron-down exercise-collapse'></i>")
                container.childNodes.forEach(node => {
                    node.setAttribute("style", "display: flex; flex-direction: column;")
                })
            })
        }
    } else {
        let exerciseCollapsers = document.querySelectorAll(".exercise-collapse")
        exerciseCollapsers.forEach(item => item.remove())
        $(".exercise-name").off("click")
        $(".exercise-name").nextAll().slideDown(0)
    }
}

window.onresize = () => {
    mobileRender()
}

const falseSubmit = document.getElementById("submit-button-false")
if (falseSubmit) {
    falseSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        alert("Please log in to save your workout.")
    })
    submitRequest("example")
} else {
    submitRequest(inputDate.value)
}