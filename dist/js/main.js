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
            key: 'addCourse',

            /**
             * Add a Course to the Optimator.
             *
             * @method
             * @param {Course} course
             */
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
        function OptimatorForm(_ref) {
            var courses = _ref.courses;
            var maxHours = _ref.maxHours;

            _classCallCheck(this, OptimatorForm);

            this.optimator = new Optimator(courses, maxHours);
        }

        /**
         * Init the form.
         * Sets event listeners.
         */

        _createClass(OptimatorForm, [{
            key: 'init',
            value: function init() {
                var _this = this;

                this._formEl = document.getElementById('courses-form');
                this._resultsEl = document.getElementById('results-table-body');

                this._formEl.addEventListener('submit', function (evt) {
                    return _this._onSubmit(evt);
                });
            }
        }, {
            key: '_onSubmit',

            /**
             * Optimize inputted courses on form submit,
             * and print the results.
             *
             * @private
             * @param evt
             */
            value: function _onSubmit(evt) {
                evt.preventDefault();
                console.warn('onSubmit not implemented!');
            }

            /**
             * Print optimized results to the results table
             *
             * @private
             * @param {Course[]} data
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
        var FORM = new OptimatorForm({
            courses: []
        });
        FORM.init();
    }

    main();
})();

//# sourceMappingURL=main.js.map