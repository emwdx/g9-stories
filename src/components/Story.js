import React from 'react';

function Story({ story }) {
  return (
    <div className="story">
      <h2>{story['Who is your story about?']}</h2>
      <p><strong>Core Value:</strong> {story['Which core value is this story associated with?']}</p>
      <p>{story['Tell the story about the ninth grader. Include good detail that makes clear why this illustrates the core value you chose.']}</p>
    </div>
  );
}

export default Story;
