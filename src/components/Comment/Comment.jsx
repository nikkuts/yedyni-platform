import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Linkify from "react-linkify";
import imageCompression from "browser-image-compression";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useAuth } from "../../hooks";

import {
  updateComment,
  deleteComment,
} from "../../redux/exercises/operations";

import { componentDecorator } from "../../service/componentDecorator";
import { formatDateTime } from "../../service/handleDate";

import { ReactComponent as MoreVertical } from "../../icons/more-vertical20.svg";
import { ReactComponent as Close } from "../../icons/x.svg";
import { ReactComponent as Edit } from "../../icons/edit.svg";
import { ReactComponent as Trash } from "../../icons/trash.svg";

import css from "./Comment.module.css";

export const Comment = ({ comment, exerciseId }) => {
  const dispatch = useDispatch();

  const { user } = useAuth();

  const textMenuRef = useRef(null);
  const fileInputRef = useRef(null);

  const [textInput, setTextInput] = useState(comment.comment);

  const [attachedFile, setAttachedFile] = useState(
    comment.fileURL
      ? {
        url: comment.fileURL,
        name: comment.fileName,
        isNew: false,
      }
      : null
  );

  const [menuVisible, setMenuVisible] = useState(false);
  const [isActiveTextarea, setIsActiveTextarea] = useState(false);
  const [isDisabledBtn, setIsDisabledBtn] = useState(false);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const validateForm = (text, file) => {
    const hasText = text.trim() !== "";
    const hasFile = file !== null;
    const textIsValid = text.length <= 3000;

    setIsDisabledBtn(!(textIsValid && (hasText || hasFile)));
  };

  const handleTextChange = (e) => {
    const textarea = e.target;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    setTextInput(textarea.value);
    setIsActiveTextarea(true);

    validateForm(textarea.value, attachedFile);
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

    validateForm(textInput, newFile);
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    validateForm(textInput, null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("exerciseId", exerciseId);
    formData.append("commentId", comment._id);
    formData.append("comment", textInput.trim());

    // якщо був старий файл і зараз його немає,
    // або був старий файл і користувач вибрав новий
    if (comment.fileURL && (!attachedFile || attachedFile.isNew)) {
      formData.append("oldFileURL", comment.fileURL);
    }

    if (attachedFile?.isNew) {
      formData.append("file", attachedFile.file);
      formData.append("fileName", attachedFile.name);
    }

    dispatch(updateComment(formData));

    setIsActiveTextarea(false);
    setMenuVisible(false);
  };

  const syncEditorState = (currentComment) => {
    setTextInput(currentComment.comment);

    setAttachedFile(
      currentComment.fileURL
        ? {
            url: currentComment.fileURL,
            name: currentComment.fileName,
            isNew: false,
          }
        : null
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetEditor = () => {
    syncEditorState(comment);
    setIsActiveTextarea(false);
    setMenuVisible(false);
  };

  useEffect(() => {
    syncEditorState(comment);
  }, [comment]);

  const handleClickOutside = (e) => {
    if (
      textMenuRef.current &&
      !textMenuRef.current.contains(e.target)
    ) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isActiveTextarea) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [isActiveTextarea]);

  return (
    <li>
      {!isActiveTextarea ? (
        <div
          className={`${css.containerComment} ${user._id === comment.author._id
            ? css.specialBackground
            : ""
            }`}
        >
          <span className={css.author}>
            {`${comment.author.first_name} ${comment.author.last_name}`}
          </span>

          <span className={css.comment}>
            <Linkify componentDecorator={componentDecorator}>
              {comment.comment}
            </Linkify>
          </span>

          {comment.fileURL && (
            <Link
              to={comment.fileURL}
              target="_blank"
              className={css.link}
            >
              📎 {comment.fileName}
            </Link>
          )}

          <span className={css.date}>
            {formatDateTime(comment.date)}
          </span>

          {user._id === comment.author._id && (
            <div
              ref={textMenuRef}
              onClick={toggleMenu}
              className={css.icon}
            >
              <MoreVertical />

              {menuVisible && (
                <ul className={css.menu}>
                  <li>
                    <Link
                      className={css.menuLink}
                      onClick={() => {
                        setMenuVisible(false);
                        setIsActiveTextarea(true);
                      }}
                    >
                      <Edit />
                      Редагувати
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={css.menuLink}
                      onClick={() =>
                        dispatch(
                          deleteComment({
                            exerciseId,
                            commentId: comment._id,
                            oldFileURL: comment.fileURL
                          })
                        )
                      }
                    >
                      <Trash />
                      Видалити
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      ) : (
        <Form
          onSubmit={handleSubmit}
          className={css.form}
        >
          <div
            className={css.close}
            onClick={() => {
              setIsActiveTextarea(false);
              setMenuVisible(false);
            }}
          >
            <Close className={css.closeIcon} />
          </div>

          <Form.Group controlId="formText">
            <Form.Label className={css.userName}>
              {`${comment.author.first_name} ${comment.author.last_name}`}
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={1}
              style={{ resize: "none", overflow: "hidden" }}
              value={textInput}
              placeholder="Написати коментар"
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
            hidden
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className={css.fileBlock}>
            {attachedFile ? (
              <>
                {!attachedFile.isNew ? (
                  <Link
                    to={attachedFile.url}
                    target="_blank"
                    className={css.link}
                  >
                    📎 {attachedFile.name}
                  </Link>
                ) : (
                  <span className={css.fileName}>
                    📎 {attachedFile.name}
                  </span>
                )}

                <div className={css.fileButtons}>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    Замінити файл
                  </Button>

                  <Button
                    type="button"
                    variant="outline-danger"
                    onClick={handleRemoveFile}
                  >
                    Видалити
                  </Button>
                </div>
              </>
            ) : (
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                Прикріпити файл
              </Button>
            )}
          </div>

          <div className={css.wrapperBtn}>
            <Button
              type="submit"
              variant="primary"
              disabled={isDisabledBtn}
              className={css.primaryBtn}
            >
              Зберегти
            </Button>

            <Button
              type="button"
              className={css.cancelBtn}
              onClick={resetEditor}
            >
              Скасувати
            </Button>
          </div>
        </Form>
      )}
    </li>
  );
};
