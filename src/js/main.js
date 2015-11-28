(function () {
    'use strict';

    /**
     * Course model
     *
     * @class
     */
    class Course {

        /**
         * Course must have a name,
         * amount of points awarded and work required (in hours).
         *
         * @constructor
         * @param {String} name Course name
         * @param {Number} points Points awarded on completion
         * @param {Number} work Work required to complete, in hours
         */
        constructor(name, points, work) {
            this.name = name;
            this.points = points;
            this.work = work;
        }
    }

    /**
     * Optimator model
     * Can be used to optimize amount of points in a given set of hours.
     *
     * @class
     */
    class Optimator {

        /**
         * The Optimator takes an Array of Course-models and the maximum amount of hours available.
         *
         * @constructor
         * @param {Course[]} [courses=[]] Courses to optimize
         * @param {Number} [maxHours=0] Maximum amount of amount available
         */
        constructor(courses = [], maxHours = 0) {
            this._courses = courses;
            this._maxHours = maxHours;
        }

        get maxHours() {
            return this._maxHours;
        }

        /**
         * Setter for maxHours
         *
         * @throws Error if value is not a positive number
         * @param hours
         */
        set maxHours(hours) {
            if (hours >= 0) {
                this._maxHours = hours;
            } else {
                throw new Error('maxHours must be a positive number!');
            }
        }

        get courses() {
            return this._courses;
        }

        /**
         * Setter for courses
         *
         * @throws Error if value is not an Array of Courses
         * @param courses
         */
        set courses(courses) {
            if (Array.isArray(courses)) {
                if (courses.length > 0 && !(courses[0] instanceof Course)) {
                    throw new Error('courses must be an Array of Courses!');
                } else {
                    this._courses = courses;
                }
            } else {
                throw new Error('courses must be an Array!');
            }
        }

        /**
         * Add a Course to the Optimator.
         *
         * @method
         * @param {Course} course
         */
        addCourse(course = null) {
            if (course !== null && course instanceof Course) {
                this.courses.push(course);
            }
        }

        /**
         * Remove a Course from the Optimator using its index
         *
         * @method
         * @param {Number} ind
         */
        removeCourseByInd(ind = -1) {
            if (ind >= 0) {
                if (this.courses.length > ind) {
                    this.courses.splice(ind, 1);
                } else {
                    throw new Error('Index out of bounds!');
                }
            } else {
                throw new Error('Index must be a positive integer!');
            }
        }

        /**
         * Remove a Course by reference.
         *
         * @method
         * @param {Course} course
         */
        removeCourse(course = null) {
            if (course !== null) {
                let ind = this.courses.indexOf(course);
                if (ind >= 0) {
                    this.courses.splice(ind, 1);
                } else {
                    throw new Error('Course not in Optimator\'s courses lists!');
                }
            } else {
                throw new Error('Give a course to remove!');
            }
        }
    }

    class OptimatorForm {
        constructor({courses, maxHours}) {
            this.optimator = new Optimator(courses, maxHours);
        }

        /**
         * Init the form.
         * Sets event listeners.
         */
        init() {
            this._formEl = document.getElementById('courses-form');
            this._resultsEl = document.getElementById('results-table-body');

            this._formEl.addEventListener('submit', evt => this._onSubmit(evt));
        }

        get formEl() {
            return this._formEl;
        }

        get resultsEl() {
            return this._resultsEl;
        }

        /**
         * Optimize inputted courses on form submit,
         * and print the results.
         *
         * @private
         * @param evt
         */
        _onSubmit(evt) {
            evt.preventDefault();
            console.warn('onSubmit not implemented!');
        }

        /**
         * Print optimized results to the results table
         *
         * @private
         * @param {Course[]} data
         */
        _printResults(data) {
            let output = '';

            if (data.length > 0) {
                data.forEach(d => {
                    output += `<tr class="new-item">
                    <td>${d.name}</td>
                    <td>${d.points}</td>
                    <td>${d.work}</td>
                </tr>`;
                });
            } else {
                output = `<tr class="new-item">
                    <td colspan="3" class="empty-row">No courses added</td>
                </tr>`;
            }

            this._resultsEl.innerHTML = output;
        }
    }

    /**
     * MAIN ENTRY POINT
     */
    function main() {
        const FORM = new OptimatorForm({
            courses: []
        });
        FORM.init();
    }

    main();
})();
