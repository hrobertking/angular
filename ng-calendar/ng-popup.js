angular.module('prototype', [ ])
.directive('calendarPopup', ['$filter', '$timeout', '$compile', function($filter, $timeout, $compile) {
    var arrow = '<div class="callout" ng-hide="!hasFocus"></div>',
        btn =   '<button class="icon calendar" ng-click="hasFocus=!hasFocus" type="button">Show Calendar</button>',
        html =  '<div class="calendar-popup-container" ng-hide="!hasFocus">' +
                '<table class="calendar" id="{{id}}-calendar-interface">' +
                '<thead>' +
                '<tr class="control buttons">' +
                '<th colspan="7">' +
                '<button class="close" ng-click="hasFocus=false" type="button">&times;</button>' +
                '</tr>' +
                '<tr class="control period">' +
                '<th colspan="7">' +
                '<fieldset>' +
                '<legend>Month</legend>' +
                '<button aria-label="{{previousMonthLabel}}" class="previous month" type="button" ng-click="prevMonth()" ng-focus="hasFocus=true">&lt;</button>' +
                '<select aria-label="" class="month" ng-focus="hasFocus=true" ng-model="month" ng-options="months.indexOf(month) as month for month in months"></select>' +
                '<button aria-label="{{nextMonthLabel}}" class="next month" type="button" ng-click="nextMonth()" ng-focus="hasFocus=true">&gt;</button>' +
                '</fieldset>' +
                '<fieldset>' +
                '<legend>Year</legend>' +
                '<button aria-label="{{previousYearLabel}}" class="previous year" type="button" ng-click="prevYear()" ng-focus="hasFocus=true">&lt;</button>' +
                '<select aria-label="" class="year" ng-focus="hasFocus=true" ng-model="year" ng-options="(years.indexOf(year) + start_year) as year for year in years"></select>' +
                '<button aria-label="{{nextYearLabel}}" class="next year" type="button" ng-click="nextYear()" ng-focus="hasFocus=true">&gt;</button>' +
                '</fieldset>' +
                '</th>' +
                '</tr>' +
                '<tr class="days" id="day_names">' +
                '<th scope="col" ng-repeat="dayColumn in dayColumns">{{dayColumn}}</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody id="{{id}}-calendar-interface-days">' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-blur="hasFocus=false" ng-click="onclick($event);" ng-focus="hasFocus=true" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</div>',
        link =  function(scope, element, attrs, ctrl) {
            /**
             * this function will need to bind the attrs.config.day to the scope.day
             * the attrs.config.month to the scope.month and the
             * attrs.config.year to the scope.year
             */

            var ndx;

            /**
             * Date format
             *
             * @type {string}
             * @see https://docs.angularjs.org/api/ng/filter/date
             */
            scope.dateformat = scope.dateformat || attrs.dateformat || 'yyyy-MM-dd';

            /**
             * The day of the week that starts the week. This is a value tied to
             * scope.days, i.e., the index given will start on that day, e.g.,
             * with defaults, a value of 0 will start on Sunday and a value of 1
             * will start on Monday.
             *
             * @type {integer}
             */
            scope.startOn = scope.startOn || 0;

            /**
             * Whether or not the component has focus
             *
             * @type {boolean}
             * @default false
             */
            scope.hasFocus = false;

            /**
             * The ISO 639 two character language code used when rendering the calendar
             * 
             * @type {string}
             */
            scope.lang = 'en';

            /**
             * Abbreviated day names for the column headers, e.g., 'Sun', 'Mon'
             * 'Fri', 'Sat'. Sunday must be the first element and Saturday the
             * last.
             *
             * @type {string[]}
             */
            scope.days = [ ];

            /**
             * The number of days in the selected month
             * @type {integer}
             */
            scope.numOfDays = 31;

            /**
             * Month names for the 'months' drop down list. January is the first
             * element and December is the last.
             *
             * @type {string[]}
             */
            scope.months = scope.months || attrs.months || [ ];

            /**
             * The years array for the 'years' drop down list. Defaults to the current
             * year minus 10 through the current year plus 10.
             *
             * @type {integer[]}
             */
            if (!scope.years || !(scope.years instanceof Array)) {
                scope.years = [ ];
                scope.start_year = scope.start_year || attrs.start_year || +(new Date()).getFullYear() - 10;
                scope.end_year = scope.end_year || attrs.end_year || +(new Date()).getFullYear() + 10;
                for (ndx = scope.start_year; ndx <= scope.end_year; ndx += 1) {
                    scope.years.push(ndx);
                }
            }

            /**
             * Parses a date input using the defined dateformat and sets the month/year for rendering
             *
             * @returns {date}
             * @param {string} value
             */
            scope.parseDate = function(value) {
                var filter = (scope.dateformat || '')
                        .replace(/\b([^HM]{1,4})\b/i, function(a) { return a.toLowerCase(); })
                        .split(/[^\w\d]/),
                    dateparts = (value || '').split(/[^\w\d/]/),
                    dt = { },
                    idx;

                /**
                 * make sure we have a value to parse
                 */
                if (!value) {
                    return;
                }

                /**
                 * step through the dateformat to parse the value provided
                 */
                for (idx = 0; idx < filter.length; idx += 1) {
                    switch (filter[idx]) {
                        case 'd':
                        case 'dd':
                            dt.day = parseFloat(dateparts[idx]);
                            break;
                        case 'ee':
                        case 'eeee':
                            break;
                        case 'h':
                        case 'hh':
                            dt.hour = parseFloat(dateparts[idx]);
                            dt.hour += ((/\bPM?\b/i).test(value) && dt.hour < 12 ? 12 : 0);
                            break;
                        case 'H':
                        case 'HH':
                            dt.hour = parseFloat(dateparts[idx]);
                            break;
                        case 'M':
                        case 'MM':
                            dt.month = parseFloat(dateparts[idx]) - 1;
                            break;
                        case 'MMM':
                        case 'MMMM':
                            /* this matches the whole string, e.g., 'January' but not 'Jan' or 'June' but not 'Jun' */
                            dt.month = scope.months.join('\n').toLowerCase().split(/\n/).indexOf(dateparts[idx].toLowerCase());
                            break;
                        case 'm':
                        case 'mm':
                            dt.minutes = parseFloat(dateparts[idx]);
                            break;
                        case 's':
                        case 'ss':
                            dt.seconds = parseFloat(dateparts[idx]);
                            break;
                        case 'sss':
                            dt.milliseconds = parseFloat(dateparts[idx]);
                            break;
                        case 'y':
                        case 'yy':
                        case 'yyy':
                        case 'yyyy':
                            dt.year = dateparts[idx];
                            break;
                    }
                }

                /**
                 * if we were able to separate the date parts, create a date
                 */
                if (dt.year > -1 && dt.month > -1 && dt.day > -1) {
                    dt = new Date(dt.year, dt.month, dt.day, dt.hours || 0, dt.minutes || 0, dt.seconds || 0, dt.milliseconds || 0);
                }

                /**
                 * if we do not have a valid date, try to use the native parsing
                 */
                if (isNaN(dt)) {
                    dt = new Date(value);
                }

                /**
                 * if we have parsed the value into a valid date, change the rendering
                 */
                if (!isNaN(dt)) {
                    dt = new Date(dt.getTime() + (dt.getTimezoneOffset() * 60000));
                    if (!isNaN(dt.getTime())) {
                        scope.month = dt.getMonth();
                        scope.year = dt.getFullYear();
                    }
                }

                return dt;
            };

            /**
             * Handles the click event on a calendar table cell.
             *
             * @returns void
             * @param {event} evt
             */
            scope.onclick = function(evt) {
                var cell = (evt || window.event).target || (evt || window.event).srcElement;
                
                setValue(cell);
            };

            /**
             * Handles the keypress event on a calendar table cell. The event handler must be
             * bound to keydown, because some UA do not pass directional keys in keypress or keyup.
             *
             * @returns void
             * @param {event} evt
             */
            scope.onkeydown = function(evt) {
                var cell = (evt || window.event).target || (evt || window.event).srcElement,
                    row = cell.parentNode,
                    tbody = row.parentNode,
                    table = tbody.parentNode,
                    key = (evt || window.event).keyCode,
                    is_last_col = (cell.cellIndex === row.cells.length - 1),
                    is_last_row = (row.rowIndex === table.rows.length - 1);

                /**
                 * if the key is a directional key, move, otherwise select/unselect the date
                 *
                 * the selection function assumes there is only one date value selected at a time
                 * if it is a range, the markup will have to be structured differently
                 * and the addition/removal of the 'selected' class will have to be different
                 */
                switch (key) {
                    case 9: /* tab */
                        break;
                    case 16: /* shift */
                        break;
                    case 32: /* space */
                        evt.preventDefault();
                        setValue(cell);
                        break;
                    case 37: /* left */
                        if (cell.cellIndex > 0) {
                            table.rows[row.rowIndex].cells[cell.cellIndex - 1].focus();
                        } else if (row.sectionRowIndex === 0) {
                            table.rows[tbody.rows[tbody.rows.length - 1].rowIndex].cells[6].focus();
                        } else {
                            table.rows[row.rowIndex - 1].cells[6].focus();
                        }
                        break;
                    case 38: /* up */
                        evt.preventDefault();
                        if (row.sectionRowIndex === 0) {
                            table.rows[tbody.rows[tbody.rows.length - 1].rowIndex].cells[cell.cellIndex].focus();
                        } else {
                            table.rows[row.rowIndex - 1].cells[cell.cellIndex].focus();
                        }
                        break;
                    case 39: /* right */
                        evt.preventDefault();
                        if (cell.cellIndex < 6) {
                            table.rows[row.rowIndex].cells[cell.cellIndex + 1].focus();
                        } else if (row.sectionRowIndex === tbody.rows.length - 1) {
                            table.rows[tbody.rows[0].rowIndex].cells[0].focus();
                        } else {
                            table.rows[row.rowIndex + 1].cells[0].focus();
                        }
                        break;
                    case 40: /* down */
                        evt.preventDefault();
                        if (row.sectionRowIndex === tbody.rows.length - 1) {
                            table.rows[tbody.rows[0].rowIndex].cells[cell.cellIndex].focus();
                        } else {
                            table.rows[row.rowIndex + 1].cells[cell.cellIndex].focus();
                        }
                        break;
                    default:
                        setValue(cell);
                        break;
                }
            };

            /**
             * Increments the month
             *
             * @returns void
             */
            scope.nextMonth = function() {
                if (scope.month === 11) {
                    scope.year += 1;
                    scope.month = 0;
                } else {
                    scope.month += 1;
                }
            };

            /**
             * Increments the year
             *
             * @returns void
             */
            scope.nextYear = function() {
                scope.year += 1;
            };

            /**
             * Decrements the month
             *
             * @returns void
             */
            scope.prevMonth = function() {
                if (scope.month === 0) {
                    scope.year -= 1;
                    scope.month = 11;
                } else {
                    scope.month -= 1;
                }
            };

            /**
             * Decrements the year
             *
             * @returns void
             */
            scope.prevYear = function() {
                scope.year -= 1;
            };

            /**
             * The table cells that represent the calendar dates.
             *
             * @type {NodeList}
             */
            scope.dayCells = null;

            /**
             * The day names used in the calendar header.
             *
             * @type {string[]}
             */
            scope.dayColumns = [ ];

            /**
             * The ID of the input element we will bind to.
             *
             * @type {string}
             */
            scope.id = attrs.bind || attrs.id;

            /**
             * Method used to render the calendar table
             *
             * @returns void
             */
            scope.render = function() {
                var MS_PER_DAY = 24 * 60 * 60 * 1000,
                    idx,
                    today = new Date(),
                    dx = scope.renderDate;

                /**
                 * check to make sure the calendar container is rendered
                 */
                if (!scope.dayCells) { return; }

                /**
                 * loop through days and set the table cell values, including aria-label
                 */
                dx = new Date(dx.getTime() - (((scope.startOn % 7) ? (dx.getDay() + (7 - (scope.startOn % 7))) : dx.getDay()) * MS_PER_DAY));
                idx = 0;
                while (idx < scope.dayCells.length) {
                    scope.dayCells.item(idx).setAttribute('aria-label', dx.getFullYear() + '-' + ('0' + (dx.getMonth() + 1)).substr(-2) + '-' + ('0' + dx.getDate()).substr(-2));
                    scope.dayCells.item(idx).className = [scope.dayCells.item(idx).className.replace(/\b(before|after|today|selected)\b/g, ''),
                            (idx < scope.renderDate.getDay() && dx.getMonth() < scope.renderDate.getMonth() ? 'before' : ''),
                            (dx.getMonth() > scope.renderDate.getMonth() || dx.getFullYear() > scope.renderDate.getFullYear() ? 'after' : ''),
                            (dx.getFullYear() === today.getFullYear() && dx.getMonth() === today.getMonth() && dx.getDate() === today.getDate() ? 'today' : '')
                        ].join(' ').replace(/\s{2,}/g, ' ').replace(/^\s*|\s*$/g, '');

                    markSelected();

                    scope.dayCells.item(idx).innerHTML = dx.getDate();
                    dx = new Date(dx.getTime() + MS_PER_DAY);
                    idx += 1;
                }
            };

            /**
             * Returns an array of day names given the language
             *
             * @returns {string[]}
             * @private
             */
            function getDayNames() {
                var names;

                switch (scope.lang) {
                    case 'zh': /* Chinese 1 */
                    case 'es': /* Spanish 2 */
                    case 'hi': /* Hindi 4 */
                    case 'ar': /* Arabic 5 */
                    case 'pt': /* Portuguese 6 */
                    case 'bn': /* Bengali 7 */
                    case 'ru': /* Russian 8 */
                    case 'jp': /* Japanese 9*/
                    case 'pa': /* Punjabi 10 */
                    case 'de': /* German */
                    case 'it': /* Italian */
                    case 'fr': /* French */
                    default:
                        names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        break;
                }
                return names;
            }

            /**
             * Returns an array of month names given the language
             *
             * @returns {void}
             * @private
             */
            function getMonthNames() {
                var names;

                switch (scope.lang) {
                    case 'zh': /* Chinese 1 */
                    case 'es': /* Spanish 2 */
                    case 'hi': /* Hindi 4 */
                    case 'ar': /* Arabic 5 */
                    case 'pt': /* Portuguese 6 */
                    case 'bn': /* Bengali 7 */
                    case 'ru': /* Russian 8 */
                    case 'jp': /* Japanese 9*/
                    case 'pa': /* Punjabi 10 */
                    case 'de': /* German */
                    case 'it': /* Italian */
                    case 'fr': /* French */
                    default:
                        names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        break;
                }

                scope.months = names;
            }

            /**
             * Returns true if the value provided is the value selected
             *
             * @returns {boolean}
             * @private
             * @param {string|date} dt
             */
            function isSelected(dt) {
                var val = new Date(scope.value);
                dt = new Date(dt);

                return (val.getFullYear() === dt.getFullYear() && val.getMonth() === dt.getMonth() && val.getDate() === dt.getDate());
            }

            /**
             * Loops through day cells and adds 'selected' to the class list if the date is selected.
             *
             * @returns void
             * @private
             */
            function markSelected() {
                ndx = scope.dayCells.length - 1;
                while (ndx > -1) {
                    scope.dayCells.item(ndx).className = [
                            (scope.dayCells.item(ndx).className.replace(/\bselected\b/, '')),
                            (isSelected(scope.dayCells.item(ndx).getAttribute('aria-label')) ? 'selected' : '')
                        ].join(' ').replace(/^\s*|\s*$/g, '');
                    ndx -= 1;
                }
            }

            /**
             * Sets the string array used as day column headers using the 'days' and 'startOn' properties.
             *
             * @returns void
             * @private
             */
            function setDayColumns() {
                scope.days = getDayNames();
                scope.dayColumns = [ ];
                for (ndx = 0; ndx < scope.days.length; ndx += 1) {
                    scope.dayColumns.push(scope.days[ (ndx + (scope.startOn % 7)) < scope.days.length ?
                                           (ndx + (scope.startOn % 7)) :
                                           ((ndx + (scope.startOn % 7)) - scope.days.length) ]);
                }
            }

            /**
             * Sets the value of the render date given the month and year before updating the related labels.
             *
             * @returns void
             * @private
             */
            function setRenderDate() {
                scope.numOfDays = 31;
                scope.numOfDays = (scope.month < 7 && scope.month%2 === 1) || (scope.month > 6 && scope.month%2 === 0) ? 30 : scope.numOfDays;
                scope.numOfDays = (scope.month === 1) ? 28 : scope.numofDays;
                scope.numOfDays = (scope.month === 1 && scope.year%4 === 0 && (scope.year%100 !== 0 || scope.year%400 === 0)) ? 29 : scope.numOfDays;
                scope.renderDate = new Date(scope.year, scope.month, 1);
                scope.nextMonthLabel = scope.months[scope.month === 11 ? 0 : scope.month + 1];
                scope.previousMonthLabel = scope.months[scope.month === 0 ? 11 : scope.month - 1];
                scope.nextYearLabel = scope.year + 1;
                scope.previousYearLabel = scope.year - 1;
                scope.render();
            }

            /**
             * Sets the 'value' using the provided calendar cell and calls the method to add/remove the
             * 'selected' class from calendar cells.
             *
             * @returns void
             * @param {HTMLElement|Date| value
             */
            function setValue(value) {
                var ds = value instanceof Date ? value.getTime() : value.getAttribute ? value.getAttribute('aria-label') : null,
                    dt = new Date(ds),
                    selected = value.className ? /\bselected\b/.test(value.className) : false;

                /**
                 * this assumes there is only one date value selected at a time
                 * if it is a range, the markup will have to be structured differently
                 * and the addition/removal of the 'selected' class will have to be different
                 */
                if (selected) {
                    scope.value = null;
                } else if (!isNaN(dt)) {
                    dt = new Date(dt.getTime() + (dt.getTimezoneOffset() * 60000));
                    scope.day = dt.getDate();
                    scope.month = dt.getMonth();
                    scope.year = dt.getFullYear();

                    scope.yearnum = '' + scope.year;
                    scope.monthnum = '' + scope.month;
                    scope.daynum = '' + scope.day;

                    scope.value = $filter('date')(dt, scope.dateformat);
                }
                markSelected();
            }

            /**
             * Initializes the calendar
             */
            $timeout(function() {
                var dates;

                /**
                 * set the day columns
                 */
                setDayColumns();

                /**
                 * set the month names
                 */
                if (!(scope.months instanceof Array) || scope.months.length < 12) {
                    getMonthNames();
                }

                /**
                 * create the monitors for localization changes
                 */
                scope.$watch('days', setDayColumns, true);
                scope.$watch('startOn', setDayColumns, true);
                scope.$watch('lang', setDayColumns, true);
                scope.$watch('lang', getMonthNames, true);

                /**
                 * create validation watchers
                 */
                scope.$watch('year', function(newval, oldval) {
                    if (isNaN(newval)) {
                        scope.year = oldval;
                    } else {
                        scope.year = parseFloat(newval);
                    }
                }, true);
                scope.$watch('yearnum', function(newval, oldval) {
                    if (isNaN(newval)) {
                        scope.yearnum = oldval;
                    } else if (scope.yearnum.length === 4) {
                        scope.year = parseFloat(newval);
                        if (scope.yearnum && scope.monthnum && scope.daynum) {
                            setValue(new Date(parseFloat(scope.yearnum), parseFloat(scope.monthnum), parseFloat(scope.daynum)));
                        }
                    }
                }, true);
                scope.$watch('month', function(newval, oldval) {
                    if (isNaN(newval)) {
                        scope.month = oldval;
                    } else {
                        scope.month = parseFloat(newval);
                    }
                }, true);
                scope.$watch('monthnum', function(newval, oldval) {
                    if (isNaN(newval)) {
                        scope.monthnum = oldval;
                    } else {
                        scope.month = parseFloat(newval);
                        if (scope.yearnum && scope.monthnum && scope.daynum) {
                            setValue(new Date(parseFloat(scope.yearnum), parseFloat(scope.monthnum), parseFloat(scope.daynum)));
                        }
                    }
                }, true);
                scope.$watch('day', function(newval, oldval) {
                    if (isNaN(newval)) {
                        scope.day = oldval;
                    } else {
                        scope.day = parseFloat(newval);
                    }
                }, true);
                scope.$watch('daynum', function(newval, oldval) {
                    if (isNaN(newval)) {
                        scope.daynum = oldval;
                    } else {
                        scope.day = parseFloat(newval);
                        if (scope.yearnum && scope.monthnum && scope.daynum) {
                            setValue(new Date(parseFloat(scope.yearnum), parseFloat(scope.monthnum), parseFloat(scope.daynum)));
                        }
                    }
                }, true);

                /**
                 * create the monitors for year and month rendering changes
                 */
                scope.$watch('year', setRenderDate, true);
                scope.$watch('month', setRenderDate, true);

                /**
                 * create the monitor for the value property
                 */
                scope.$watch('value', scope.parseDate, true);

                /**
                 * set the render date
                 */
                scope.renderDate = scope.renderDate ? new Date(scope.renderDate) : null;
                if (!scope.renderDate || isNaN(scope.renderDate)) {
                    scope.renderDate = new Date();
                }
                scope.renderDate.setDate(1);
                scope.month = scope.renderDate.getMonth();
                scope.year = scope.renderDate.getFullYear();

                /**
                 * set the value
                 */
                scope.value = scope.value ? $filter('date')(scope.value, scope.dateformat) : null;

                /**
                 * set the bound input element
                 */
                scope.input = angular.element(document.getElementById(scope.id));
                scope.input.on('blur', function() {
                    scope.hasFocus = false;
                });
                scope.input.on('focus', function() {
                    scope.hasFocus = true;
                });

                /**
                 * set the day cells
                 */
                dates = document.getElementById(scope.id + '-calendar-interface-days');
                scope.dayCells = dates ? dates.getElementsByTagName('td') : [ ];

                scope.render();
            }, 0);
        };

    return {
        restrict: 'A',
        scope: true,
        compile: function(element, attrs) {
            /**
             * if we have a properly formed calendar-popup we should have a config object
             * as part of the attrs object
             */
            if (attrs.config) {
                return link;
            }
        },
        template: function(element, attrs) {
            var el,
                ui = angular.element(html)[0],
                callout;

            /**
             * uses unnamed arguments as a list
             */
            function findAncestor() {
                var nodes = Array.prototype.slice.call(arguments),
                    level,
                    node,
                    ubound,
                    matches,
                    is_match,
                    common,
                    p,
                    path,
                    paths = [ ];

                /**
                 * establish the path to document.body and select the length of the shortest path as the maximum upper boundary
                 */
                for (node = 0; node < nodes.length; node += 1) {
                    p = nodes[node].parentNode;
                    path = [ ];
                    while (p !== document.body) {
                        path.unshift(p);
                        p = p.parentNode;
                    }
                    paths[node] = path;
                    ubound = Math.min(ubound === null || ubound === undefined ? path.length : ubound, path.length);
                }

                /**
                 * loop through the ancestors and test to find the last matching
                 */
                level = 0;
                is_match = true;
                while (is_match && level < ubound) {
                    for (node = 1; node < paths.length; node += 1) {
                        is_match = paths[0][level].isEqualNode(paths[node][level]);
                    }
                    common = is_match ? paths[0][level] : common;
                    level += 1;
                }
                return common || document.body;
            }

            /**
             * adds or replaces a rule in the definition and returns the new string
             */
            function setStyle(elem, prop, value) {
                var style = elem.getAttribute('style'),
                    result = { },
                    attr = (style || '').split(';'),
                    rule,
                    ndx,
                    prop;

                result[prop] = value;
                for (ndx = 0; ndx < attr.length; ndx += 1) {
                    rule = attr[ndx].split(':');
                    prop = rule.splice(0, 1)[0];
                    if (prop) {
                        result[prop] = rule.join(':');
                    }
                }

                style = [ ];
                for (ndx in result) {
                    if (ndx && result.hasOwnProperty(ndx)) {
                        style.push(ndx + ': ' + result[ndx]);
                    }
                }
                return style.join(';');
            }

            function setProps(item) {
                var opts;

                /**
                 * if we have a select element that does not use ng-options
                 * we have to do extra work to simulate 2-way binding
                 */
                switch (item.getAttribute('name').toLowerCase()) {
                    case 'year':
                        attrs.config.year = item.getAttribute('id');
                        item.setAttribute('ng-model', 'yearnum');
                        if (item.nodeName.toLowerCase() === 'select' && !item.getAttribute('ng-options')) {
                            opts = angular.element(item).find('option');
                            angular.forEach(opts, function(opt) {
                                if (!isNaN(opt.innerHTML)) {
                                    opt.setAttribute('ng-selected', "yearnum == " + parseFloat(opt.innerHTML));
                                } else if (opt.getAttribute('value')) {
                                    opt.setAttribute('ng-selected', "yearnum == " + opt.getAttribute('value'));
                                } else {
                                    /* we don't know how to handle this case */
                                }
                            });
                        }
                        break;
                    case 'month':
                        attrs.config.month = item.getAttribute('id');
                        item.setAttribute('ng-model', 'monthnum');
                        if (item.nodeName.toLowerCase() === 'select' && !item.getAttribute('ng-options')) {
                            opts = angular.element(item).find('option');
                            angular.forEach(opts, function(opt, ndx) {
                                if (!isNaN(opt.innerHTML)) {
                                    opt.setAttribute('ng-selected', "monthnum == " + (parseFloat(opt.innerHTML) - 1));
                                } else {
                                    opt.setAttribute('ng-selected', "monthnum == " + (ndx - (opts.length > 12 ? 1 : 0)));
                                    if (!opt.getAttribute('value') || isNaN(opt.getAttribute('value'))) {
                                        opt.setAttribute('value', ndx - 1);
                                    }
                                }
                            });
                        }
                        break;
                    case 'day':
                        attrs.config.day = item.getAttribute('id');
                        item.setAttribute('ng-model', 'daynum');
                        if (item.nodeName.toLowerCase() === 'select' && !item.getAttribute('ng-options')) {
                            opts = angular.element(item).find('option');
                            angular.forEach(opts, function(opt) {
                                if (!isNaN(opt.innerHTML)) {
                                    opt.setAttribute('ng-selected', "daynum == " + parseFloat(opt.innerHTML));
                                } else if (opt.getAttribute('value')) {
                                    opt.setAttribute('ng-selected', "daynum == " + opt.getAttribute('value'));
                                } else {
                                    /* we don't know how to handle this case */
                                }
                            });
                        }
                        break;
                }
            }

            /**
             * try to set the props based on an object passed in the calendar-popup attribute
             */
            try {
                attrs.config = JSON.parse(attrs.calendarPopup
                        .replace(/(\{|\,)\s*\'([^\']+)\'\s*\:/g, '$1"$2":')
                        .replace(/\:\s*\'([^\']+)\'\s*(\}|\,)/g, ':"$1"$2'));
            } catch(ignore) {
                attrs.config = {
                    modal: true,
                    direction: 'b',
                    day: null,
                    month: null,
                    year: null
                };
            }

            /**
             * sanity check on the datepart inputs
             */
            attrs.config.day = (attrs.dayId && document.getElementById(attrs.dayId)) ? attrs.dayId : null;
            attrs.config.month = (attrs.monthId && document.getElementById(attrs.monthId)) ? attrs.monthId : null;
            attrs.config.year = (attrs.yearId && document.getElementById(attrs.yearId)) ? attrs.yearId : null;

            /**
             * validate the elements to be bound and bind them
             */
            if (!attrs.config.day || !attrs.config.month || !attrs.config.year) {
                angular.forEach(element.find('input'), setProps);
                angular.forEach(element.find('select'), setProps);
            }

            /**
             * if we don't have the necessary elements, abort the process, otherwise build the ancestor trees
             * and figure out where to add the HTML
             */
            if (!attrs.config.day || !attrs.config.month || !attrs.config.year) {
                delete attrs.config;
                element.removeAttr('calendar-popup');
            } else {
                element.attr('calendar-popup', JSON.stringify(attrs.config).replace(/\"/g, "'"));

                attrs.id = attrs.id || 'ng-calendar-popup-' + (new Date()).getTime();
                element.attr('id', attrs.id);

                element.attr('style', setStyle(element[0], 'overflow', 'auto'));

                /**
                 * find the ancestor of the input interface
                 */
                el = findAncestor(document.getElementById(attrs.config.day),
                        document.getElementById(attrs.config.month),
                        document.getElementById(attrs.config.year));

                /**
                 * add the calendar interface as a sibling of the input interface
                 */
                callout = angular.element(arrow).addClass(attrs.config.direction);

                el.setAttribute('style', setStyle(el, 'display', (attrs.config.direction === 'left') ? 'inline-block' : 'block'));

                el.appendChild(angular.element(btn)[0]);
                el.parentNode.insertBefore(ui, el.nextSibling);
                el.parentNode.insertBefore(callout[0], ui);
            }

            /**
             * clean up popup-related attributes
             */
            element.removeAttr('data-day-id');
            element.removeAttr('data-month-id');
            element.removeAttr('data-year-id');

            return element[0].outerHtml;
        }
    };
}]);
