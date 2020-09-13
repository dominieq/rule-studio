import React from 'react';

const RuleType = {
  Number: 1,
  Range: 2,
  GreaterThan: 3,
  LessThan: 4
};

/**
 * This is the numeric filter, which appears for the Integer and Real value type attributes.
 * 
 * @class
 * @category Tabs
 * @subcategory NumericFilters
 * @param {Object} props - Object passed from the external library (react-data-grid).
 * @param {Object} props.column - The column on which filter was used.
 * @param {function} props.onChange - Method runs when there is some change in the filter field.
 * @returns {React.Component}
 */
class NumericFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.getRules = this.getRules.bind(this);
  }

  filterValues(row, columnFilter, columnKey) {
    if (columnFilter.filterTerm == null) {
      return true;
    }
    let result = false;
    // implement default filter logic
    let value = -1;
    if(columnFilter.column.valueType === "real") value = parseFloat(row[columnKey]);
    else value = parseInt(row[columnKey], 10);
       
    for (const ruleKey in columnFilter.filterTerm) {
      if (!columnFilter.filterTerm.hasOwnProperty(ruleKey)) {
        continue;
      }

      const rule = columnFilter.filterTerm[ruleKey];

      switch (rule.type) {
      case RuleType.Number:
        if(rule.value === "?" && row[columnKey] === "?") result = true; 
        
        else if (rule.value === value) {
            result = true;
        }
        
        break;
      case RuleType.GreaterThan:
        if (rule.value < value) {
          result = true;
        }
        break;
      case RuleType.LessThan:
        if (rule.value > value) {
          result = true;
        }
        break;
      case RuleType.Range:
        if (rule.begin <= value && rule.end >= value ) {
          result = true;
        }
        break;
      default:
        // do nothing
        break;
      }
    }
    return result;
  }

  getRules(value) {
    const rules = [];
    if (value === '') {
      return rules;
    }
    // check comma
    const list = value.split(',');
    if (list.length > 0) {
      // handle each value with comma
      for (const key in list) {
        if (!list.hasOwnProperty(key)) {
          continue;
        }

        const obj = list[key];
        if (obj.indexOf(':') > 0) { // handle colon
          const begin = parseFloat(obj.split(':')[0]);
          const end = parseFloat(obj.split(':')[1]);
          rules.push({ type: RuleType.Range, begin: begin, end: end });
        } else if (obj.indexOf('>') > -1) { // handle greater than
          const begin = parseFloat(obj.split('>')[1]);
          rules.push({ type: RuleType.GreaterThan, value: begin });
        } else if (obj.indexOf('<') > -1) { // handle less than
          const end = parseFloat(obj.split('<')[1]);
          rules.push({ type: RuleType.LessThan, value: end });
        } else { // handle normal values
          const numericValue = (obj === "?" ? "?" : parseFloat(obj));
          rules.push({ type: RuleType.Number, value: numericValue });
        }
      }
    }
    return rules;
  }

  handleKeyPress(e) { // Validate the input
    const regex = '>|<|:|,|([0-9?.-])';
    const result = RegExp(regex).test(e.key);
    if (result === false) {
      e.preventDefault();
    }
  }

  handleChange(e) {
    const value = e.target.value;
    const filters = this.getRules(value);
    this.props.onChange({ filterTerm: (filters.length > 0 ? filters : null), column: this.props.column, rawValue: value, filterValues: this.filterValues });
  }

  render() {
    const inputKey = 'header-filter-' + this.props.column.key;
    const columnStyle = {
        float: 'left',
        marginRight: 4,
        width: 'calc(100% - 30px)'
    };
    const badgeStyle = {
      cursor: 'help'
    };

    const tooltipText = 'Input Methods: Value (x), Range (x:y), Greater than (>x), Less than (<y). Separator , stands for OR';

    return (
      <div>
        <div style={columnStyle}>
          <input key={inputKey} type="text" placeholder="e.g. 3,10:15,>20" className="form-control input-sm" onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
        </div>
        <div className="input-sm">
          <span className="badge" style={badgeStyle} title={tooltipText}>?</span>
        </div>
      </div>
    );
  }
}

export default NumericFilter;