ng-calendar
==========

## What is this?

**ng-calendar** are date input interfaces for Angularjs (not Angular 2). They are a work in progress, but are available for use as is.

There are two interfaces, an inline (default open) calendar you can bind to a single text input and a calendar callout that can be bound to a date part input collection. The markup needed for each type is shown in the details below.

### Inline

An inline date collection input can be added by using the ng-calendar.css, ng-calendar-inline.css, and the ng-calendar.js and by using the following markup

```html
<div class="field"> 
  <label for="dob">Date of Birth</label>
  <input id="dob" type="text" calendar />
</div>
```

The inline date collection will draw a calendar on desktop and hide the text input. On mobile, the text input is shown and the calendar is displayed when the field has focus.

### Callout

A date input callout can be added by using the ng-calendar.css, ng-calendar-popup.css, and ng-popup.js along with markup that identifies date-part collection inputs.

```html
<div calendar-popup="{'direction':'bottom'}" data-day-id="dob_fld_day" data-month-id="dob_fld_month" data-year-id="dob_fld_year">
  <fieldset>
    <legend>Date of Birth</legend>
    <span class="day">
      <select id="dob_fld_day" name="day">
        <option>DD</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option>
      </select>
      <label for="dob_fld_day">Day</label>
    </span>
    <span class="month">
      <select id="dob_fld_month" name="month">
        <option>MM</option><option>January</option><option>February</option><option>March</option><option>April</option><option>May</option><option>June</option><option>July</option><option>August</option><option>September</option><option>October</option><option>November</option><option>December</option>
      </select>
      <label for="dob_fld_month">Month</label>
    </span>
    <span class="year">
      <input id="dob_fld_year" maxlength="4" name="year" size="4" type="text" />
      <label for="dob_fld_year">Year</label>
    </span>
  </fieldset>
</div>
```

The second method is preferred, because at the minute it's the only method that allows progressive enhancement.
