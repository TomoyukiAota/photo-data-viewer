import { fireEvent, render, screen } from '@testing-library/react';

import PhotoImage from './PhotoImage';

describe('PhotoImage', () => {
  it('says the format is unsupported in place of an image the browser cannot show, and shows the next image', () => {
    const { rerender } = render(<PhotoImage url='blob:broken' alt='broken.jpg' />);
    fireEvent.error(screen.getByAltText('broken.jpg'));
    expect(screen.getByText('Unsupported File Format')).toBeTruthy();
    expect(screen.queryByAltText('broken.jpg')).toBeNull();

    rerender(<PhotoImage url='blob:next' alt='next.jpg' />);
    expect(screen.getByAltText('next.jpg')).toBeTruthy();
    expect(screen.queryByText('Unsupported File Format')).toBeNull();
  });

  it('names the rotate icon for screen readers and tooltips', () => {
    render(<PhotoImage url='blob:photo' alt='photo.jpg' />);
    expect(screen.getByAltText('Rotate photo').title).toBe('Rotate photo');
  });
});
