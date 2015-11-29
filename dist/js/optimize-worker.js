'use strict';

self.onmessage = function onmessage(_ref) {
    'use strict';

    var data = _ref.data;
    switch (data.cmd) {
        case 'start':
            {
                var courses = data.courses;
                var maxHours = data.maxHours;

                var res = optimize(courses, maxHours);
                self.postMessage(res);
                break;
            }
        default:
            {
                break;
            }
    }
};

/**
 * Optimize an array of courses to get the maximum amount of points in the allowed maxHours.
 * NOTE: At this point, Course-objects have been serialized so we need to access the private
 * _work and _points properties (methods cannot be serialized).
 *
 * @param courses
 * @param maxHours
 * @returns {{optimized: Array, totalPts: number, totalWork: number}}
 */
function optimize(courses, maxHours) {
    'use strict';

    var totalPts = 0;
    var totalWork = 0;
    var optimized = []; // Final, optimized set of Courses

    var numCourses = courses.length;

    // Skip the algorithm completely if there aren't any courses or
    // if we don't have any hours to fill up
    if (maxHours > 0 && numCourses > 0) {

        // No need for the algorithm
        // if we only have one Course that fits.
        // But bail out if there's only one Course and it doesn't fit.
        if (numCourses === 1 && courses[0]._work <= maxHours) {
            totalPts = courses[0]._points;
            totalWork = courses[0]._work;
            optimized.push(courses[0]);
        } else if (numCourses > 1) {

            /**
             * The Knapsack algorithm
             * Based on:
             * https://www.youtube.com/watch?v=EH6h7WA7sDw &
             * https://gist.github.com/danwoods/7496329
             */

            var courseInd = undefined;
            var workInd = undefined;
            var maxPrev = undefined;
            var maxNew = undefined;

            // Setup matrices (create (numCourses + 1) * (maxHours +1) sized empty Arrays)
            var workMatrix = new Array(numCourses + 1);
            var keepMatrix = new Array(numCourses + 1);
            for (courseInd = 0; courseInd < numCourses + 1; courseInd++) {
                workMatrix[courseInd] = new Array(maxHours + 1);
                keepMatrix[courseInd] = new Array(maxHours + 1);
            }

            // Build the workMatrix
            for (courseInd = 0; courseInd <= numCourses; courseInd++) {
                for (workInd = 0; workInd <= maxHours; workInd++) {

                    // Caching items
                    var rW = workMatrix[courseInd];
                    var rwPrev = workMatrix[courseInd - 1];
                    var rK = keepMatrix[courseInd];
                    var c = courses[courseInd - 1];

                    // Fill top row (representing a knapsack that can fit 0 hours of work)
                    // and left column with zeros.
                    if (courseInd === 0 || workInd === 0) {
                        rW[workInd] = 0;
                    } else if (c._work <= workInd) {
                        // If the Course will fit, compare the values of keeping it or leaving it
                        maxNew = c._points + rwPrev[workInd - c._work];
                        maxPrev = rwPrev[workInd];

                        // Update the matrices
                        if (maxNew > maxPrev) {
                            rW[workInd] = maxNew;
                            rK[workInd] = 1;
                        } else {
                            rW[workInd] = maxPrev;
                            rK[workInd] = 0;
                        }
                    } else {
                        // Else, the course can't fit
                        // => points and work are the same as before.
                        rW[workInd] = rwPrev[workInd];
                    }
                }
            }
            //// Traverse through keepMatrix ([numItems][capacity] -> [1][?])
            //// to create the optimized set of courses.
            //workInd = maxHours;
            //courseInd = numCourses;
            //for (courseInd; courseInd > 0; courseInd--) {
            //    if (keepMatrix[courseInd][workInd] === 1) {
            //        optimized.push(courses[courseInd - 1]);
            //        totalWork += courses[courseInd - 1]._work;
            //        workInd = workInd - courses[courseInd - 1]._work;
            //    }
            //}
            //
            //totalPts = workMatrix[numCourses][maxHours];
        }
    }

    return { optimized: optimized, totalPts: totalPts, totalWork: totalWork };
}

//# sourceMappingURL=optimize-worker.js.map