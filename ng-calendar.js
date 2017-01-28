angular.module('prototype', [ ])
.directive('calendar', ['$filter', '$timeout', function($filter, $timeout) {
    var link = function(scope, element, attrs, ctrl) {
            var ndx;

            /**
             * configuration: date format
             */
            scope.dateformat = scope.dateformat || attrs.dateformat || 'yyyy-MM-dd';

            /**
             * configuration: days for the column headers
             */
            scope.days = [
                    $filter('date')(new Date(1970, 0, 4), 'EEE'),
                    $filter('date')(new Date(1970, 0, 5), 'EEE'),
                    $filter('date')(new Date(1970, 0, 6), 'EEE'),
                    $filter('date')(new Date(1970, 0, 7), 'EEE'),
                    $filter('date')(new Date(1970, 0, 8), 'EEE'),
                    $filter('date')(new Date(1970, 0, 9), 'EEE'),
                    $filter('date')(new Date(1970, 0, 10), 'EEE')
                ];

            /**
             * configuration: months for the drop down
             */
            scope.months = scope.months || attrs.months || [ ];
            if (!(scope.months instanceof Array) || scope.months.length < 12) {
                scope.months = [
                        $filter('date')(new Date(1970, 0, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 1, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 2, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 3, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 4, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 5, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 6, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 7, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 8, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 9, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 10, 1), 'MMMM'),
                        $filter('date')(new Date(1970, 11, 1), 'MMMM')
                    ];
            }

            /**
             * configuration: day of the week to start the calendar on -- 0 = sunday, 6 = saturday
             */
            scope.startOn = scope.startOn || 0;

            /**
             * configuration: years for the drop down
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
             * default values
             */
            scope.values = [ ];

            scope.renderDate = scope.renderDate || new Date();
            if (!(scope.renderDate instanceof Date)) {
                scope.renderDate = new Date(scope.renderDate);
            }
            scope.renderDate.setDate(1);

            scope.month = scope.renderDate.getMonth();
            scope.year = scope.renderDate.getFullYear();

            /**
             * parses a date input
             */
            scope.parseDate = function(value) {
                var filter = (scope.dateformat || '')
                        .replace(/\b([^HM]{1,4})\b/i, function(a) { return a.toLowerCase(); })
                        .split(/[^\w\d]/),
                    dateparts = (value || '').split(/[^\w\d/]/),
                    dt = { },
                    idx;

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

                if (dt.year > -1 && dt.month > -1 && dt.day > -1) {
                    dt = new Date(dt.year, dt.month, dt.day, dt.hours || 0, dt.minutes || 0, dt.seconds || 0, dt.milliseconds || 0);
                }

                if (isNaN(dt)) {
                    dt = new Date(value);
                }

                if (!isNaN(dt) && dt instanceof Date) {
                    dt = new Date(dt.getTime() + (dt.getTimezoneOffset() * 60000));
                    if (!isNaN(dt.getTime())) {
                        scope.value = dt.getTime();
                    }
                }
            };

            /**
             * event handlers
             */
            scope.onclick = function(evt) {
                var cell = (evt || window.event).target || (evt || window.event).srcElement;

                toggle(cell);
            };

            /**
             * this must be bound to keydown, because some UA do not pass directional keys in keypress or keyup
             */
            scope.onkeydown = function(evt) {
                var cell = (evt || window.event).target || (evt || window.event).srcElement,
                    row = cell.parentNode,
                    tbody = row.parentNode,
                    table = tbody.parentNode,
                    key = (evt || window.event).keyCode;

                /**
                 * if the key is a directional key, move, otherwise select/unselect the date
                 *
                 * the selection function assumes there is only one date value selected at a time
                 * if it is a range, the markup will have to be structured differently
                 * and the addition/removal of the 'selected' class will have to be different
                 */
                switch (key) {
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
                        if (row.sectionRowIndex === 0) {
                            table.rows[tbody.rows[tbody.rows.length - 1].rowIndex].cells[cell.cellIndex].focus();
                        } else {
                            table.rows[row.rowIndex - 1].cells[cell.cellIndex].focus();
                        }
                        break;
                    case 39: /* right */
                        if (cell.cellIndex < 6) {
                            table.rows[row.rowIndex].cells[cell.cellIndex + 1].focus();
                        } else if (row.sectionRowIndex === tbody.rows.length - 1) {
                            table.rows[tbody.rows[0].rowIndex].cells[0].focus();
                        } else {
                            table.rows[row.rowIndex + 1].cells[0].focus();
                        }
                        break;
                    case 40: /* down */
                        if (row.sectionRowIndex === tbody.rows.length - 1) {
                            table.rows[tbody.rows[0].rowIndex].cells[cell.cellIndex].focus();
                        } else {
                            table.rows[row.rowIndex + 1].cells[cell.cellIndex].focus();
                        }
                        break;
                    case 9: /* tab */
                        break;
                    default:
                        toggle(cell);
                        break;
                }
            };

            scope.nextMonth = function() {
                scope.month += (scope.month === 11 ? -11 : 1);
            };
            scope.nextYear = function() {
                scope.year += 1;
            };
            scope.prevMonth = function() {
                scope.month += (scope.month === 0 ? 11 : -1);
            };
            scope.prevYear = function() {
                scope.year += -1;
            };

            /**
             * intialize the day header
             */
            scope.dayColumns = [ ];
            function setDayColumns() {
                scope.dayColumns = [ ];
                for (ndx = 0; ndx < scope.days.length; ndx += 1) {
                    scope.dayColumns.push(scope.days[ (ndx + (scope.startOn % 7)) < scope.days.length ?
                                           (ndx + (scope.startOn % 7)) :
                                           ((ndx + (scope.startOn % 7)) - scope.days.length) ]);
                }
            }
            setDayColumns();

            /**
             * watch for changes in localization
             */
            scope.$watch('days', setDayNames, true);
            scope.$watch('startOn', setDayNames, true);

            /**
             * watch for changes of the month or year
             */
            scope.$watch('year', setRenderDate, true);
            scope.$watch('month', setRenderDate, true);

            /**
             * bind to the element
             */
            scope.input = element[0];
            scope.id = scope.input.nodeName.toLowerCase() === 'calendar' ? scope.input.getAttribute('bind') : scope.input.id;

            /**
             * calendar dates as a node list
             */
            scope.dayCells = null;

            scope.render = function() {
                var MS_PER_DAY = 24 * 60 * 60 * 1000,
                    idx,
                    today = new Date(),
                    iso = /^(\d{4}\D\d{2}\D\d{2})/,
                    dx = scope.renderDate;

                /**
                 * check to make sure the calendar is rendered
                 */
                if (!scope.dayCells) { init(); }

                /**
                 * loop through days and set the table cell values, including aria-label
                 */
                dx = new Date(dx.getTime() - (((scope.startOn % 7) ? (dx.getDay() + (7 - (scope.startOn % 7))) : dx.getDay()) * MS_PER_DAY));
                idx = 0;
                while (idx < scope.dayCells.length) {
                    scope.dayCells.item(idx).setAttribute('aria-label', iso.exec(dx.toISOString())[1]);
                    scope.dayCells.item(idx).className = [scope.dayCells.item(idx).className.replace(/\b(before|after|today|selected)\b/g, ''),
                            (idx < scope.renderDate.getDay() && dx.getMonth() < scope.renderDate.getMonth() ? 'before' : ''),
                            (dx.getMonth() > scope.renderDate.getMonth() || dx.getFullYear() > scope.renderDate.getFullYear() ? 'after' : ''),
                            (dx.getFullYear() === today.getFullYear() && dx.getMonth() === today.getMonth() && dx.getDate() === today.getDate() ? 'today' : '')
                        ].join(' ').replace(/\s{2,}/g, ' ').replace(/^\s*|\s*$/g, '');

                    scope.dayCells.item(idx).innerHTML = dx.getDate();
                    dx = new Date(dx.getTime() + MS_PER_DAY);
                    idx += 1;
                }

                markSelected();
            };

            function init() {
                var dates = document.getElementById(scope.id + '-calendar-interface-days');

                /**
                 * make sure the input has the 'calendar' attribute even if the directive is called as an element
                 */
                scope.input = document.getElementById(scope.id);
                scope.input.setAttribute('calendar', 'true');

                /**
                 * initialize the dayCells property so we can render the calendar days
                 */
                scope.dayCells = dates ? dates.getElementsByTagName('td') : [ ];
                setDayNames();
            }
            function isSelected(dt) {
                var val,
                    ndx;

                /**
                 * make sure we're evaluating a date
                 */
                if (!(dt instanceof Date)) {
                    dt = new Date(dt);
                }

                return (scope.values.findByValue(dt) > -1);
            }
            function markSelected() {
                var ndx = scope.dayCells.length - 1;

                while (ndx > -1) {
                    scope.dayCells.item(ndx).className = [
                            (scope.dayCells.item(ndx).className.replace(/\bselected\b/, '')),
                            (isSelected(scope.dayCells.item(ndx).getAttribute('aria-label')) ? 'selected' : '')
                        ].join(' ').replace(/^\s*|\s*$/g, '');
                    ndx -= 1;
                }
            }
            function setDayNames() {
                var nodes = document.getElementById(scope.id + '-calendar-interface-day-names'),
                    ndx;

                nodes = nodes ? nodes.getElementsByTagName('th') : [ ];
                if (nodes.length >= scope.days.length) {
                    for (ndx = 0; ndx < scope.days.length; ndx += 1) {
                        nodes.item(ndx).innerHTML = scope.days[ (ndx + (scope.startOn % 7)) < scope.days.length ?
                                               (ndx + (scope.startOn % 7)) :
                                               ((ndx + (scope.startOn % 7)) - scope.days.length) ];
                    }
                }
            }
            function setRenderDate() {
                scope.renderDate = new Date(scope.year, scope.month, 1);
                scope.nextMonthLabel = scope.months[scope.month === 11 ? 0 : scope.month + 1];
                scope.previousMonthLabel = scope.months[scope.month === 0 ? 11 : scope.month - 1];
                scope.nextYearLabel = scope.year + 1;
                scope.previousYearLabel = scope.year - 1;
                scope.render();
            }
            function toggle(cell) {
                var ds = cell.getAttribute('aria-label'),
                    dt = new Date(ds),
                    selected = /\bselected\b/,
                    is_selected = selected.test(cell.className);

                dt = new Date(dt.getTime() + (dt.getTimezoneOffset() * 60000));
                if (!isNaN(dt.getTime())) {
                    if (is_selected) {
                        cell.className = cell.className.replace(selected, '');
                        scope.values.remove(dt);
                    } else {
                        cell.className += ' selected';
                        cell.className = cell.className.replace(/^\s*|\s*$/g, '');
                        scope.values.push(dt);
                    }
                }
            }

            /**
             * set up a method to find by value
             */
            if (!scope.values.findByValue) {
                scope.values.findByValue = function(value) {
                    var ndx = this.length - 1,
                        val;

                    if (!(value instanceof Date)) {
                        value = new Date(value);
                    }
                    value = new Date(value.getTime() + (value.getTimezoneOffset() * 60000));

                    while (ndx > -1) {
                        val = this[ndx];
                        if (value.getFullYear() === val.getFullYear() &&
                            value.getMonth() === val.getMonth() &&
                            value.getDate() === val.getDate()) {
                            return ndx;
                        }
                        ndx -= 1;
                    }
                    return ndx;
                };
            }
            /**
             * set up a method to remove an array element by value
             */
            if (!scope.values.remove) {
                scope.values.remove = function(value) {
                   var ndx = this.length - 1,
                       val;

                   /**
                    * looping backwards is more than a faster performer
                    * it's used here to make sure we don't skip values or
                    * accidently delete something we don't want to delete
                    */
                   if (!(value instanceof Date)) {
                       value = new Date(value);
                   }
                   value = value.getTime();

                   while (ndx > -1) {
                       val = this[ndx].getTime();
                       if (val == value) {
                           this.splice(ndx, 1);
                       }
                       ndx -= 1;
                   }
                   return ndx;
                };
            }
            /**
             * set up a method to calculate the week in case we need it
             */
            if (!(new Date()).getWeek) {
                Date.prototype.getWeek = function() {
                    var dt = new Date(this.getTime()),
                        j1 = new Date(dt.getFullYear(), 0, 1)
                        ms = 7 * 24 * 60 * 60 * 1000,
                        wk = 0;

                    /**
                     * if the year starts on Thursday or before,
                     * the calculation is a straight subtract and divide
                     * but if it's not we have to determine if we're really
                     * looking at the 53rd week of last year
                     */
                    if (j1.getDay() > 4) {
                        if (dt.getDate() > 3) {
                            j1.setDate(j1.getDate() + 4 - (j1.getDay() - 4));
                        } else {
                            j1 = new Date(j1.getFullYear() - 1, 0, 1);
                        }
                    }
                    return Math.floor((dt.getTime() - j1.getTime()) / ms) + 1;
                };
            }

            $timeout(function() {
                init();
                scope.render();
            }, 0);

        },
        html = '<table class="calendar" id="{{id}}-calendar-interface">' +
                '<thead>' +
                '<tr class="control">' +
                '<th colspan="7">' +
                '<fieldset>' +
                '<legend>Month</legend>' +
                '<button aria-label="{{previousMonthLabel}}" class="previous month" ng-click="prevMonth()" type="button">&lt;</button>' +
                '<select aria-label="" class="month" ng-model="month" ng-options="months.indexOf(month) as month for month in months"></select>' +
                '<button aria-label="{{nextMonthLabel}}" class="next month" ng-click="nextMonth()" type="button">&gt;</button>' +
                '</fieldset>' +
                '<fieldset>' +
                '<legend>Year</legend>' +
                '<button aria-label="{{previousYearLabel}}" class="previous year" ng-click="prevYear()" type="button">&lt;</button>' +
                '<select aria-label="" class="year" ng-model="year" ng-options="(years.indexOf(year) + start_year) as year for year in years"></select>' +
                '<button aria-label="{{nextYearLabel}}" class="next year" ng-click="nextYear()" type="button">&gt;</button>' +
                '</fieldset>' +
                '</th>' +
                '</tr>' +
                '<tr class="days" id="{{id}}-calendar-interface-day-names">' +
                '<th scope="col"></th>' +
                '<th scope="col"></th>' +
                '<th scope="col"></th>' +
                '<th scope="col"></th>' +
                '<th scope="col"></th>' +
                '<th scope="col"></th>' +
                '<th scope="col"></th>' +
                '</tr>' +
                '</thead>' +
                '<tbody id="{{id}}-calendar-interface-days">' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '<tr>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '<td ng-click="onclick($event);" ng-keydown="onkeydown($event);" tabindex="0"></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>'
            ;

    return {
        restrict: 'AE',
        link: link,
        template: function(element, attrs) {
            var e = element[0];

            if (e.nodeName.toLowerCase() === 'calendar') {
                return html;
            } else {
                return '';
            }
        },
        compile: function(element) {
            var e = element[0],
                l = e.labels;

            if (e.nodeName.toLowerCase() === 'calendar') {
                return link;
            } else {
                e = l.length ? angular.element(l.item(l.length - 1)) : null;
                e.after(html);

                return link;
            }
        }
    };
}]);
