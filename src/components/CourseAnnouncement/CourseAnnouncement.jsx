import { useState } from "react";
import { convertLinks } from "../../service/convertLinks";
import css from './CourseAnnouncement.module.css';
import axios from "axios";
import {AXIOS_BASE_URL} from '../../constants';

axios.defaults.baseURL = AXIOS_BASE_URL;

export const CourseAnnouncement = ({ userStatus, courseId, announcement }) => {
  const [text, setText] = useState(announcement || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.patch(`/api/courses/${courseId}`, {
        announcement: text,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Помилка при оновленні оголошення:", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================
  //     ADMIN VIEW
  // ====================
  if (userStatus === "admin" || userStatus === "moderator") {
  
    return (
      <div className={css.box}>
        <h3 className={css.title}>Оголошення</h3>

        {isEditing ? (
          <textarea
            className={css.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
        ) : (
            <p
                className={css.text}
                dangerouslySetInnerHTML={{ __html: convertLinks(text) }}
            />
        )}

        <div className={css.buttons}>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={css.editBtn}
            >
              Редагувати
            </button>
          )}

          {isEditing && (
            <>
              <button
                onClick={handleSave}
                className={css.saveBtn}
                disabled={loading}
              >
                {loading ? "Збереження..." : "Зберегти"}
              </button>

              <button
                onClick={() => {
                  setText(announcement || "");
                  setIsEditing(false);
                }}
                className={css.cancelBtn}
              >
                Скасувати
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ====================
  //     USER VIEW
  // ====================
    if (userStatus === "user") {
        if (!announcement || announcement.trim() === "") return null;

        return (
        <div className={css.box}>
            <h3 className={css.title}>Оголошення</h3>
            <p
                className={css.text}
                dangerouslySetInnerHTML={{ __html: convertLinks(announcement) }}
            />
        </div>
        );
    }

  return null;
}
