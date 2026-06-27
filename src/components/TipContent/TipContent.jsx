import renderContent from '../../service/renderContent';
import css from './TipContent.module.css';

const TipContent = ({ tip }) => {
    if (!tip) {
        return (
            <div className={css.tipContent}>
                Оберіть пораду зі списку.
            </div>
        );
    }

    return (
        <div className={css.tipContent}>
            <h1>{tip.title}</h1>

            <div className={css.tipText}>
                {renderContent(tip.content)} 
            </div>
        </div>
    );
};

export default TipContent;
