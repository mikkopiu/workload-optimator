'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict'

    /**
     * Course model
     *
     * @class
     */
    ;

    var Course = (function () {

        /**
         * Course must have a name,
         * amount of points awarded and work required (in hours).
         *
         * @constructor
         * @param {String} name Course name
         * @param {Number} points Points awarded on completion
         * @param {Number} work Work required to complete, in hours
         */

        function Course(name, points, work) {
            _classCallCheck(this, Course);

            this.name = name;
            this.points = points;
            this.work = work;
        }

        _createClass(Course, [{
            key: 'points',
            get: function get() {
                return this._points;
            },
            set: function set(p) {
                this._points = p >= 0 ? p : 0;
            }
        }, {
            key: 'work',
            get: function get() {
                return this._work;
            },
            set: function set(p) {
                this._work = p >= 0 ? p : 0;
            }
        }]);

        return Course;
    })();

    /**
     * Optimator model
     * Can be used to optimize amount of points in a given set of hours.
     *
     * @class
     */

    var Optimator = (function () {

        /**
         * The Optimator takes an Array of Course-models and the maximum amount of hours available.
         *
         * @constructor
         * @param {Course[]} [courses=[]] Courses to optimize
         * @param {Number} [maxHours=0] Maximum amount of amount available
         */

        function Optimator() {
            var courses = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
            var maxHours = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            _classCallCheck(this, Optimator);

            this.courses = courses;
            this.maxHours = maxHours;
            this._worker = new Worker('dist/js/optimize-worker.js');
        }

        _createClass(Optimator, [{
            key: 'startOptimization',

            /**
             * Optimize course selections with a Web Worker
             */
            value: function startOptimization() {
                this.worker.postMessage({ 'cmd': 'start', 'courses': this.courses, 'maxHours': this.maxHours });
            }

            /**
             * Get a Course by its row index
             * @param {Number} ind
             * @returns {Course}
             */

        }, {
            key: 'getCourseByInd',
            value: function getCourseByInd(ind) {
                return this.courses[ind];
            }

            /**
             * Add a Course to the Optimator.
             *
             * @method
             * @param {Course} course
             */

        }, {
            key: 'addCourse',
            value: function addCourse() {
                var course = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

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

        }, {
            key: 'removeCourseByInd',
            value: function removeCourseByInd() {
                var ind = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];

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

        }, {
            key: 'removeCourse',
            value: function removeCourse() {
                var course = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

                if (course !== null) {
                    var ind = this.courses.indexOf(course);
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

        }, {
            key: 'clearCourses',
            value: function clearCourses() {
                this.courses = [];
            }
        }, {
            key: 'maxHours',
            get: function get() {
                return this._maxHours;
            }

            /**
             * Setter for maxHours
             *
             * @throws Error if value is not a positive number
             * @param hours
             */
            ,
            set: function set(hours) {
                if (!isNaN(hours) && hours >= 0) {
                    this._maxHours = hours;
                } else {
                    throw new Error('maxHours must be a positive number!');
                }
            }
        }, {
            key: 'courses',
            get: function get() {
                return this._courses;
            }

            /**
             * Setter for courses
             *
             * @throws Error if value is not an Array of Courses
             * @param courses
             */
            ,
            set: function set(courses) {
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
        }, {
            key: 'worker',
            get: function get() {
                return this._worker;
            }
        }]);

        return Optimator;
    })();

    var OptimatorForm = (function () {
        function OptimatorForm() {
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var _ref$courses = _ref.courses;
            var courses = _ref$courses === undefined ? [] : _ref$courses;
            var _ref$maxHours = _ref.maxHours;
            var maxHours = _ref$maxHours === undefined ? 0 : _ref$maxHours;

            _classCallCheck(this, OptimatorForm);

            this.optimator = new Optimator(courses, maxHours);

            this._onOptimizeWorkerComplete = this._onOptimizeWorkerComplete.bind(this);
            this._onSubmit = this._onSubmit.bind(this);
            this._onAddRow = this._onAddRow.bind(this);
            this._onRemoveRow = this._onRemoveRow.bind(this);
        }

        _createClass(OptimatorForm, [{
            key: 'init',
            value: function init() {
                var addBtn = document.getElementById('add-btn');
                this._totalHoursInputEl = document.getElementById('total-hours-input');
                this._formEl = document.getElementById('courses-form');
                this._coursesEl = document.getElementById('courses-table-body');
                this._resultsBodyEl = document.getElementById('results-table-body');
                this._totalPointsEl = document.getElementById('total-points');
                this._totalWorkEl = document.getElementById('total-work');
                var initialRowDeleteBtn = this.coursesEl.querySelector('.remove-btn');

                // Create event listeners (and remove any previous listeners)
                this.optimator.worker.removeEventListener('message', this._onOptimizeWorkerComplete);
                this.optimator.worker.addEventListener('message', this._onOptimizeWorkerComplete);
                this._formEl.removeEventListener('submit', this._onSubmit);
                this._formEl.addEventListener('submit', this._onSubmit);
                addBtn.removeEventListener('click', this._onAddRow);
                addBtn.addEventListener('click', this._onAddRow);
                initialRowDeleteBtn.removeEventListener('click', this._onRemoveRow);
                initialRowDeleteBtn.addEventListener('click', this._onRemoveRow);
            }
        }, {
            key: 'addRow',

            /**
             * Add a row to the courses table
             */
            value: function addRow() {
                var rowEl = document.createElement('tr');
                rowEl.classList.add('input-row');
                rowEl.innerHTML = '<td>\n                <input class="input-name" type="text" placeholder="Course name" required>\n            </td>\n            <td>\n                <input class="input-points" type="number" min="0" placeholder="Course points" required>\n            </td>\n            <td>\n                <input class="input-work" type="number" min="0" placeholder="Work required in hours" required>\n            </td>\n            <td>\n                <button class="remove-btn" type="button">Remove</button>\n            </td>';

                rowEl.querySelector('.remove-btn').addEventListener('click', this._onRemoveRow);

                this.coursesEl.appendChild(rowEl);
            }

            /**
             * Remove a row from the courses table
             * @param {Number} ind Row index to remove
             */

        }, {
            key: 'removeRow',
            value: function removeRow(ind) {
                var targetRow = this.coursesEl.querySelectorAll('tr')[ind];
                this.coursesEl.removeChild(targetRow);
            }
        }, {
            key: '_onOptimizeWorkerComplete',
            value: function _onOptimizeWorkerComplete() {
                var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                var data = _ref2.data;
                var optimized = data.optimized;
                var totalPts = data.totalPts;
                var totalWork = data.totalWork;

                this._printResults(optimized, totalPts, totalWork);
            }

            /**
             * Add row -button handler
             * @param {MouseEvent} evt
             * @private
             */

        }, {
            key: '_onAddRow',
            value: function _onAddRow(evt) {
                evt.preventDefault();
                this.addRow();
            }

            /**
             * Remove-button handler
             * @param {MouseEvent} evt
             * @private
             */

        }, {
            key: '_onRemoveRow',
            value: function _onRemoveRow(evt) {
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

        }, {
            key: '_onSubmit',
            value: function _onSubmit(evt) {
                evt.preventDefault();

                this.optimator.maxHours = OptimatorForm._parseToPositiveFloat(this.totalHoursInputEl.value);
                var rows = this.coursesEl.querySelectorAll('.input-row');

                this.optimator.clearCourses();

                for (var i = 0; i < rows.length; i++) {
                    this.optimator.addCourse(new Course(rows[i].querySelector('.input-name').value, OptimatorForm._parseToPositiveFloat(rows[i].querySelector('.input-points').value), OptimatorForm._parseToPositiveFloat(rows[i].querySelector('.input-work').value)));
                }

                this.resultsBodyEl.innerHTML = '<tr>\n                <td colspan="3" style="text-align: center"><div class="spinner-loader">Loading&hellip;</div></td>\n            </tr>';

                this.optimator.startOptimization();
            }

            /**
             * Parse a String (work hours / points) to a positive float.
             *
             * @param {String} str Work hours or points
             * @returns {number} Parsed float
             * @static
             * @private
             */

        }, {
            key: '_printResults',

            /**
             * Print optimized results to the results table
             *
             * @param {Course[]} data
             * @param {Number} totalPoints
             * @param {Number} totalWork
             * @private
             */
            value: function _printResults(data, totalPoints, totalWork) {
                var output = '';

                // NOTE: At this point, Course-objects have been serialized so we need to access the private
                // _work and _points properties (methods cannot be serialized).
                if (data.length > 0) {
                    data.forEach(function (d) {
                        output += '<tr class="new-item">\n                    <td>' + d.name + '</td>\n                    <td>' + d._points + '</td>\n                    <td>' + d._work + '</td>\n                </tr>';
                    });
                } else {
                    output = '<tr class="new-item">\n                    <td colspan="3" class="empty-row">No courses selected</td>\n                </tr>';
                }

                this.resultsBodyEl.innerHTML = output;
                this.totalPointsEl.innerHTML = totalPoints;
                this.totalWorkEl.innerHTML = totalWork;
            }
        }, {
            key: 'totalHoursInputEl',
            get: function get() {
                return this._totalHoursInputEl;
            }

            /**
             * @returns {Element|*}
             */

        }, {
            key: 'formEl',
            get: function get() {
                return this._formEl;
            }

            /**
             * @returns {Element|*}
             */

        }, {
            key: 'coursesEl',
            get: function get() {
                return this._coursesEl;
            }

            /**
             * @returns {Element|*}
             */

        }, {
            key: 'resultsBodyEl',
            get: function get() {
                return this._resultsBodyEl;
            }
        }, {
            key: 'totalPointsEl',
            get: function get() {
                return this._totalPointsEl;
            }
        }, {
            key: 'totalWorkEl',
            get: function get() {
                return this._totalWorkEl;
            }
        }], [{
            key: '_parseToPositiveFloat',
            value: function _parseToPositiveFloat(str) {
                var num = 0;

                if (str !== '') {
                    var parsed = parseFloat(str.replace(',', '.'));
                    num = parsed >= 0 ? parsed : 0;
                }

                return num;
            }
        }]);

        return OptimatorForm;
    })();

    /**
     * MAIN ENTRY POINT
     */

    function main() {
        var FORM = new OptimatorForm();
        FORM.init();
    }

    main();
})();

//# sourceMappingURL=main.js.map