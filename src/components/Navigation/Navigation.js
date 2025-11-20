import { NavLink } from "react-router-dom";
import css from "./Navigation.module.css";

export const Navigation = () => {

  return (
    <nav className={css.nav}>
      <NavLink 
        className={({ isActive }) => 
          isActive ? `${css.link} ${css.active}` : css.link
        } 
        to=""
        end
      >
        Домашня
      </NavLink>

      <NavLink 
        className={({ isActive }) => 
          isActive ? `${css.link} ${css.active}` : css.link
        } 
        to="learn"
      >
        Курси
      </NavLink>

      <NavLink 
        className={({ isActive }) => 
          isActive ? `${css.link} ${css.active}` : css.link
        } 
        to="game"
      >
        Паляниця
      </NavLink>
    </nav>
  );
};
