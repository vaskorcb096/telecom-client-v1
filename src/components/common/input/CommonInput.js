import { Input } from "@nextui-org/react";

const CommonInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  size = "md",
  startContent,
  endContent,
  className,
  radius = "sm",
  labelPlacement,
  variant = "bordered",
  placeholder = "Search",
  labelTextSize = "text-sm",
  inputTextSize = "text-sm",
  onClick,
  errorMessage,
  isRequired,
  isDisabled
}) => {
  return (
    <Input
      className={className}
      classNames={{
        base: "",
        mainWrapper: "",
        input: `${inputTextSize}`,
        label: `font-mulish text-neutral p-0 mb-2 ${labelTextSize}`,
        inputWrapper: `text-neutral bg-neutral-100 card-box-shadow ${variant === "bordered" && "border-1"
          }`,
      }}
      size={size}
      name={name}
      type={type}
      value={value}
      label={label}
      radius={radius}
      variant={variant}
      onChange={onChange}
      endContent={endContent}
      placeholder={placeholder}
      startContent={startContent}
      labelPlacement={labelPlacement}
      onClick={onClick}
      // isInvalid={true}
      errorMessage={errorMessage}
      isRequired={isRequired}
      isDisabled={isDisabled}
    />
  );
};

export default CommonInput;
