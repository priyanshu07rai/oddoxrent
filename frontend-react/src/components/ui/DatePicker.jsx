import React from 'react';
import Input from './Input';

const DatePicker = React.forwardRef((props, ref) => {
  return (
    <Input
      type="date"
      ref={ref}
      {...props}
      className={`cursor-pointer ${props.className || ''}`}
    />
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
