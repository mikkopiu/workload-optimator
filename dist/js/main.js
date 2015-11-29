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

    var Course =

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
    };

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

            this._courses = courses;
            this._maxHours = maxHours;
        }

        _createClass(Optimator, [{
            key: 'getCourseByInd',

            /**
             * Get a Course by its row index
             * @param {Number} ind
             * @returns {Course}
             */
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
                if (hours >= 0) {
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
            this._onSubmit = this._onSubmit.bind(this);
            this._onAddRow = this._onAddRow.bind(this);
            this._onRemoveRow = this._onRemoveRow.bind(this);
        }

        /**
         * Init the form.
         * Sets event listeners.
         */

        _createClass(OptimatorForm, [{
            key: 'init',
            value: function init() {
                var addBtn = document.getElementById('add-btn');
                this._formEl = document.getElementById('courses-form');
                this._coursesEl = document.getElementById('courses-table-body');
                this._resultsEl = document.getElementById('results-table-body');

                var initialRowDeleteBtn = this.coursesEl.querySelector('.remove-btn');

                // Clear out any previous listeners
                this._formEl.removeEventListener('submit', this._onSubmit);
                this._formEl.addEventListener('submit', this._onSubmit);
                addBtn.removeEventListener('click', this._onAddRow);
                addBtn.addEventListener('click', this._onAddRow);
                initialRowDeleteBtn.removeEventListener('click', this._onRemoveRow);
                initialRowDeleteBtn.addEventListener('click', this._onRemoveRow);
            }

            /**
             * @returns {Element|*}
             */

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
                console.warn('onSubmit not implemented!');
            }

            /**
             * Print optimized results to the results table
             *
             * @param {Course[]} data
             * @private
             */

        }, {
            key: '_printResults',
            value: function _printResults(data) {
                var output = '';

                if (data.length > 0) {
                    data.forEach(function (d) {
                        output += '<tr class="new-item">\n                    <td>' + d.name + '</td>\n                    <td>' + d.points + '</td>\n                    <td>' + d.work + '</td>\n                </tr>';
                    });
                } else {
                    output = '<tr class="new-item">\n                    <td colspan="3" class="empty-row">No courses added</td>\n                </tr>';
                }

                this._resultsEl.innerHTML = output;
            }
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
            key: 'resultsEl',
            get: function get() {
                return this._resultsEl;
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