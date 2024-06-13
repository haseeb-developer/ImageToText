import React, { useState } from "react";
import FileBase64 from "react-file-base64";
import Tesseract from "tesseract.js";

const ImageToText = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // State for image URL input
  const [language, setLanguage] = useState("eng"); // Default language: English

  const handleImageUpload = (file) => {
    setError("");
    setImage(file.base64);
    setImageUrl(""); // Clear image URL if file upload is used
    setText("");
    setProgress(0);
  };

  const handleUrlInputChange = (event) => {
    setImageUrl(event.target.value);
    setError(""); // Clear any previous errors when URL changes
  };

  const handleExtractText = () => {
    if (!image && !imageUrl) {
      setError("Please upload an image or enter an image URL.");
      return;
    }

    setLoading(true);
    setProgress(0);

    const imageSource = imageUrl || image;

    Tesseract.recognize(imageSource, language, {
      // Use selected language
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => {
        setLoading(false);
        setText(text || "No text found in the image.");
      })
      .catch((err) => {
        setLoading(false);
        setError("Error processing the image. Please try again.");
        console.error(err);
      });

    let simulatedProgress = 0;
    const interval = setInterval(() => {
      simulatedProgress += 1;
      setProgress(simulatedProgress);
      if (simulatedProgress >= 100) {
        clearInterval(interval);
      }
    }, 60);
  };

  const handleReset = () => {
    setImage(null);
    setImageUrl("");
    setText("");
    setError("");
    setProgress(0);
  };

  const handleCopyText = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="container">
      <div className="section">
        <h2>Upload Image or Enter Image URL</h2>
        <FileBase64 multiple={false} onDone={handleImageUpload} />
        <input
          type="text"
          placeholder="Paste image URL here"
          value={imageUrl}
          onChange={handleUrlInputChange}
          className="urlInput"
        />
        {image && <img src={image} alt="Uploaded" className="image" />}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="From URL"
            className="image"
            onError={() => setError("Invalid image URL")}
          />
        )}
        <button
          onClick={handleExtractText}
          disabled={loading}
          className="button"
        >
          {loading ? `Converting... ${progress}%` : "Convert Image to Text"}
        </button>
        {error && <p className="error">{error}</p>}
        <button onClick={handleReset} className="resetButton">
          Start New Session
        </button>
        <div className="languageSelect">
          <label htmlFor="language">Select Language:</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="eng">English</option>
            <option value="deu">German</option>
            <option value="fra">French</option>
            <option value="spa">Spanish</option>
            <option value="por">Portuguese</option>
            <option value="urd">Urdu</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>
      <div className="section">
        <h2>Extracted Text</h2>
        <textarea value={text} readOnly className="textarea" />
        <button onClick={handleCopyText} className="copyButton">
          Copy Text
        </button>
      </div>
    </div>
  );
};

export default ImageToText;
