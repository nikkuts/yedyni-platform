import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import imageCompression from "browser-image-compression";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { Comment } from "../Comment/Comment";
import { addComment } from "../../redux/exercises/operations";
import { selectExercise } from "../../redux/exercises/selectors";
import { useAuth } from "../../hooks";

import css from "./CommentsList.module.css";

export const CommentsList = () => {
  const dispatch = useDispatch();

  const { user } = useAuth();
  const { _id, comments } = useSelector(selectExercise);

  const fileInputRef = useRef(null);

  const [textInput, setTextInput] = useState("");
  const [isActiveTextarea, setIsActiveTextarea] = useState(false);

  // прикріплений файл
  const [attachedFile, setAttachedFile] = useState(null);

  const isDisabledBtn =
    textInput.length > 3000 ||
    (textInput.trim() === "" && attachedFile === null);

  const handleTextChange = (e) => {
    const textarea = e.target;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    setTextInput(textarea.value);
    setIsActiveTextarea(true);
  };

  const handleFileChange = async (e) => {
    let file = e.target.files[0];

    if (!file) return;

    if (file.type.startsWith("image/")) {
      try {
        file = await imageCompression(file, {
          useWebWorker: true,
        });
      } catch (error) {
        console.error(error);
      }
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Файл повинен бути не більше 10 Мб.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const newFile = {
      file,
      name: file.name,
      isNew: true,
    };

    setAttachedFile(newFile);
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("exerciseId", _id);
    formData.append("comment", textInput.trim());

    if (attachedFile?.isNew) {
      formData.append("file", attachedFile.file);
      formData.append("fileName", attachedFile.name);
    }

    dispatch(addComment(formData));

    setTextInput("");
    setAttachedFile(null);
    setIsActiveTextarea(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isActiveTextarea) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [isActiveTextarea]);

  return (
    <div className={css.containerComments}>
      <h2 className={css.title}>Коментарі</h2>

      <Form
        onSubmit={handleSubmit}
        className={css.form}
      >
        <Form.Group controlId="formText">
          <Form.Label className={css.userName}>
            {`${user.first_name} ${user.last_name}`}
          </Form.Label>

          <Form.Control
            as="textarea"
            rows={1}
            style={{ resize: "none", overflow: "hidden" }}
            placeholder="Написати коментар"
            value={textInput}
            onChange={handleTextChange}
            className={css.textarea}
          />

          {isDisabledBtn && isActiveTextarea && (
            <div className={css.text}>
              Коментар повинен містити текст або файл.
              Максимальна довжина тексту —
              3000 символів.
            </div>
          )}
        </Form.Group>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className={css.wrapperBtn}>
          <Button
            type="button"
            variant="outline-secondary"
            className={css.fileBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            {attachedFile
              ? "Замінити файл"
              : "Прикріпити файл"}
          </Button>

          {attachedFile && (
            <div className={css.fileInfo}>
              <span className={css.fileName}>
                📎 {attachedFile.name}
              </span>

              <Button
                type="button"
                variant="outline-danger"
                className={css.fileBtn}
                onClick={handleRemoveFile}
              >
                Видалити
              </Button>
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={isDisabledBtn}
            className={css.primaryBtn}
          >
            Відправити
          </Button>
        </div>
      </Form>

      <ul className={css.list}>
        {comments
          .slice()
          .reverse()
          .map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              exerciseId={_id}
            />
          ))}
      </ul>
    </div>
  );
};
