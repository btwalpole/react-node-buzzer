import "./Button.css";

function Button({ children, className, ...rest }) {
  let buttonClassName = 'button';

  //if we're passed className, include that in the Button styles
  if (className) {
    buttonClassName = `${buttonClassName} ${className}`;
  }

  /*
  let { disabled } = rest;
  if (disabled) {
    buttonClassName = `${buttonClassName} disabled`;
  }
  */

  return (
    <button className={buttonClassName} {...rest}>
      {children}
    </button>
  );
}

export default Button;