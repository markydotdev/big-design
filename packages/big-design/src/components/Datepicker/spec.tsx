import 'jest-styled-components';

import React, { createRef } from 'react';
import type { ReactDatePicker } from 'react-datepicker';
import { act } from 'react-dom/test-utils';

import { fireEvent, render } from '@test/utils';

import { FormGroup } from '..';

import { Datepicker } from './index';

test('should use the passed in ref object if provided', () => {
  const ref = createRef<ReactDatePicker>();
  const { container } = render(<Datepicker onDateChange={jest.fn()} ref={ref} />);

  const input = container.querySelector('input');

  fireEvent.click(input as HTMLInputElement);

  const datepicker = container.querySelector('.react-datepicker');

  expect(
    datepicker?.className.includes(ref.current?.props.calendarClassName as string),
  ).toBeTruthy();
});

test('renders select label', () => {
  const { getByText } = render(
    <Datepicker data-testid="datepicker" label={'test'} onDateChange={jest.fn()} />,
  );

  expect(getByText('test')).toBeInTheDocument();
});

test('calls onDateChange function when a date cell is clicked', () => {
  const changeFunction = jest.fn();
  const { container } = render(<Datepicker onDateChange={changeFunction} />);

  const input = container.querySelector('input');

  fireEvent.click(input as HTMLInputElement);

  const datepicker = container.querySelector('.react-datepicker');

  const cell = datepicker?.querySelector('.react-datepicker__day--today');

  act(() => {
    fireEvent.click(cell as HTMLElement);
  });

  expect(changeFunction).toHaveBeenCalled();
});

test('no error when input date value manually', () => {
  const changeFunction = jest.fn();
  const { container } = render(<Datepicker onDateChange={changeFunction} />);

  const dateString = 'Wed, 03 June, 2020';
  const input = container.querySelector('input');

  fireEvent.input(input as HTMLInputElement, {
    target: {
      value: dateString,
    },
  });

  expect(changeFunction).not.toHaveBeenCalled();
  expect(input?.getAttribute('value')).toEqual(dateString);
});

test('renders an error if one is provided', () => {
  const { getByText } = render(
    <FormGroup>
      <Datepicker error="Required" onDateChange={jest.fn()} />
    </FormGroup>,
  );

  expect(getByText('Required')).toBeInTheDocument();
});

test('appends (optional) text to label if select is not required', () => {
  const { container } = render(<Datepicker label="label" onDateChange={jest.fn()} />);
  const label = container.querySelector('label');

  expect(label).toHaveStyleRule('content', "' (optional)'", { modifier: '::after' });
});

test('dates before minimum date passed are disabled', () => {
  const selectedDate = '2020/1/5';
  const minimumDate = '2020/1/4';
  const { container } = render(
    <Datepicker label="label" min={minimumDate} onDateChange={jest.fn()} value={selectedDate} />,
  );
  const input = container.querySelector('input');

  fireEvent.click(input as HTMLInputElement);

  const disabledDate = container.querySelector('.react-datepicker__day--003');

  expect(disabledDate?.classList.contains('react-datepicker__day--disabled')).toBe(true);
});

test('dates after max date passed are disabled', () => {
  const selectedDate = '2020/1/5';
  const maximumDate = '2020/1/10';
  const { container } = render(
    <Datepicker label="label" max={maximumDate} onDateChange={jest.fn()} value={selectedDate} />,
  );
  const input = container.querySelector('input');

  fireEvent.click(input as HTMLInputElement);

  const disabledDate = container.querySelector('.react-datepicker__day--011');

  expect(disabledDate?.classList.contains('react-datepicker__day--disabled')).toBe(true);
});
