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

        get points() {
            return this._points;
        }

        set points(p) {
            this._points = p >= 0 ? p : 0;
        }

        get work() {
            return this._work;
        }

        set work(p) {
            this._work = p >= 0 ? p : 0;
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
            this.courses = courses;
            this.maxHours = maxHours;
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
            if (!isNaN(hours) && hours >= 0) {
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
         * Optimize course selections
         * @returns {{keep: Array, totalPts: number, totalWork: number}}
         */
        getOptimizedCourses() {
            let v = [];
            let keep = [];
            let totalPts = 0;
            let totalWork = 0;

            // Skip the algorithm completely if there aren't any courses or
            // if we don't have any hours to fill up
            if (this.maxHours > 0 && this.courses.length > 0) {

                // No need for the algorithm also
                // if we only have one course to fit.
                if (this.courses.length === 1) {
                    keep.push(this.courses[0]);
                    totalPts = this.courses[0].points;
                    totalWork = this.courses[0].work;
                } else {
                    // TODO: actual work
                    console.warn('Doing actual work');
                }
            }

            return {keep, totalPts, totalWork};
        }

        /**
         * Get a Course by its row index
         * @param {Number} ind
         * @returns {Course}
         */
        getCourseByInd(ind) {
            return this.courses[ind];
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

        /**
         * Clear all Courses
         */
        clearCourses() {
            this.courses = [];
        }
    }

    class OptimatorForm {
        constructor({courses = [], maxHours = 0} = {}) {
            this.optimator = new Optimator(courses, maxHours);
            this._onSubmit = this._onSubmit.bind(this);
            this._onAddRow = this._onAddRow.bind(this);
            this._onRemoveRow = this._onRemoveRow.bind(this);
        }

        /**
         * Init the form.
         * Sets event listeners.
         */
        init() {
            let addBtn = document.getElementById('add-btn');
            this._totalHoursInputEl = document.getElementById('total-hours-input');
            this._formEl = document.getElementById('courses-form');
            this._coursesEl = document.getElementById('courses-table-body');
            this._resultsBodyEl = document.getElementById('results-table-body');
            this._totalPointsEl = document.getElementById('total-points');
            this._totalWorkEl = document.getElementById('total-work');

            let initialRowDeleteBtn = this.coursesEl.querySelector('.remove-btn');

            // Clear out any previous listeners
            this._formEl.removeEventListener('submit', this._onSubmit);
            this._formEl.addEventListener('submit', this._onSubmit);
            addBtn.removeEventListener('click', this._onAddRow);
            addBtn.addEventListener('click', this._onAddRow);
            initialRowDeleteBtn.removeEventListener('click', this._onRemoveRow);
            initialRowDeleteBtn.addEventListener('click', this._onRemoveRow);
        }

        get totalHoursInputEl() {
            return this._totalHoursInputEl;
        }

        /**
         * @returns {Element|*}
         */
        get formEl() {
            return this._formEl;
        }

        /**
         * @returns {Element|*}
         */
        get coursesEl() {
            return this._coursesEl;
        }

        /**
         * @returns {Element|*}
         */
        get resultsBodyEl() {
            return this._resultsBodyEl;
        }

        get totalPointsEl() {
            return this._totalPointsEl;
        }

        get totalWorkEl() {
            return this._totalWorkEl;
        }

        /**
         * Add a row to the courses table
         */
        addRow() {
            let rowEl = document.createElement('tr');
            rowEl.classList.add('input-row');
            rowEl.innerHTML = `<td>
                <input class="input-name" type="text" placeholder="Course name" required>
            </td>
            <td>
                <input class="input-points" type="number" min="0" placeholder="Course points" required>
            </td>
            <td>
                <input class="input-work" type="number" min="0" placeholder="Work required in hours" required>
            </td>
            <td>
                <button class="remove-btn" type="button">Remove</button>
            </td>`;

            rowEl.querySelector('.remove-btn').addEventListener('click', this._onRemoveRow);

            this.coursesEl.appendChild(rowEl);
        }

        /**
         * Remove a row from the courses table
         * @param {Number} ind Row index to remove
         */
        removeRow(ind) {
            let targetRow = this.coursesEl.querySelectorAll('tr')[ind];
            this.coursesEl.removeChild(targetRow);
        }

        /**
         * Add row -button handler
         * @param {MouseEvent} evt
         * @private
         */
        _onAddRow(evt) {
            evt.preventDefault();
            this.addRow();
        }

        /**
         * Remove-button handler
         * @param {MouseEvent} evt
         * @private
         */
        _onRemoveRow(evt) {
            evt.preventDefault();
            // rowIndex is 1-based
            this.removeRow(evt.target.parentElement.parentElement.rowIndex - 1);
        }

        /**
         * Optimize inputted courses on form submit,
         * and print the results.
         *
         * @param evt
         * @private
         */
        _onSubmit(evt) {
            evt.preventDefault();

            this.optimator.maxHours = OptimatorForm._parseToPositiveFloat(this.totalHoursInputEl.value);
            let rows = this.coursesEl.querySelectorAll('.input-row');

            this.optimator.clearCourses();

            for (let i = 0; i < rows.length; i++) {
                this.optimator.addCourse(new Course(
                    rows[i].querySelector('.input-name').value,
                    OptimatorForm._parseToPositiveFloat(rows[i].querySelector('.input-points').value),
                    OptimatorForm._parseToPositiveFloat(rows[i].querySelector('.input-work').value)
                ));
            }

            let {keep:optimized, totalPts, totalWork} = this.optimator.getOptimizedCourses();
            this._printResults(optimized, totalPts, totalWork);
        }

        /**
         * Parse a String (work hours / points) to a positive float.
         *
         * @param {String} str Work hours or points
         * @returns {number} Parsed float
         * @static
         * @private
         */
        static _parseToPositiveFloat(str) {
            let num = 0;

            if (str !== '') {
                let parsed = parseFloat(str.replace(',', '.'));
                num = parsed >= 0 ? parsed : 0;
            }

            return num;
        }

        /**
         * Print optimized results to the results table
         *
         * @param {Course[]} data
         * @param {Number} totalPoints
         * @param {Number} totalWork
         * @private
         */
        _printResults(data, totalPoints, totalWork) {
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
                    <td colspan="3" class="empty-row">No courses selected</td>
                </tr>`;
            }

            this.resultsBodyEl.innerHTML = output;
            this.totalPointsEl.innerHTML = totalPoints;
            this.totalWorkEl.innerHTML = totalWork;
        }
    }

    /**
     * MAIN ENTRY POINT
     */
    function main() {
        const FORM = new OptimatorForm();
        FORM.init();
    }

    main();
})();
