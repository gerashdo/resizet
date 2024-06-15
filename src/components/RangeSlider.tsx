import { ChangeEvent } from 'react';
import './RangeSlider.css';

interface SliderProps {
  label?: string
  min: number
  max: number
  step: number
  initialValue: number
  onChange: (value: number) => void
}

const RangeSlider: React.FC<SliderProps> = ({ label, min, max, step, initialValue, onChange }) => {

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  return (
    <div className="slider-container">
      {label && <label className="title" htmlFor='range-slider'>{label}</label>}
      <div className="slider-wrapper">
        <input
          id='range-slider'
          type="range"
          min={min}
          max={max}
          step={step}
          value={initialValue}
          onChange={handleInputChange}
        />
        <span
          className="tooltip"
          >
          {initialValue}%
        </span>
      </div>
      <div className="slider-labels">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
