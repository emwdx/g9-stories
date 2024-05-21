import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';

function App() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [randomStory, setRandomStory] = useState(null);
  const [selectedCoreValue, setSelectedCoreValue] = useState('');

  const coreValues = ["Kindness", "Respect", "Responsibility", "Positivity", "Integrity", "Belonging"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vS-G9c-yVcu8Qrgtu8kIM3UAFwWK8D2gYzpMFhC7nOKYznJHzxPby-9ZLRk_YXBsKMmhuXLrLFbxoAQ/pub?gid=480186919&single=true&output=tsv');
        const data = response.data.split('\n').map(row => row.split('\t'));
        
        const headers = data[0].map(header => header.trim());
        
        const stories = data.slice(1).map(row => {
          let story = {};
          row.forEach((cell, index) => {
            const key = headers[index];
            if (key) {
              story[key] = cell.trim();
            }
          });
          return story;
        });
        
        const transformedStories = stories.map(story => ({
          timestamp: story['Timestamp'],
          emailAddress: story['Email Address'],
          who: story['Who is your story about?'],
          coreValue: story['Which core value is this story associated with?'],
          story: story['Tell the story about the ninth grader. Include good detail that makes clear why this illustrates the core value you chose.']
        }));
        
        setStories(transformedStories);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = (coreValue) => {
    const filteredStories = stories.filter(story => story.coreValue === coreValue);
    const randomIndex = Math.floor(Math.random() * filteredStories.length);
    setRandomStory(filteredStories[randomIndex]);
    setSelectedCoreValue(coreValue);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <h1>Ninth Grade Celebration: Stories of Values</h1>
      <div className="button-container">
        {coreValues.map((coreValue, index) => (
          <Button
            key={index}
            variant="primary"
  
            className="mb-3 large-button"
            onClick={() => handleButtonClick(coreValue)}

           
          >
            <h1>{coreValue}</h1>
          </Button>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="large-modal" className = "large-modal">
        <Modal.Header closeButton>
          <Modal.Title>{selectedCoreValue}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className = "storyText">{randomStory && randomStory.story}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default App;


