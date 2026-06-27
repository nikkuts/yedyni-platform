import css from './TipsList.module.css';

const TipsList = ({ tips, selectedTipId, onSelect }) => {
    return (
        <div className={css.tipsList}>
            {tips.map((tip) => (
                <button
                    key={tip._id}
                    className={`${css.tipItem} ${
                        selectedTipId === tip._id ? css.active : ''
                    }`}
                    onClick={() => onSelect(tip._id)}
                >
                    {tip.title}
                </button>
            ))}
        </div>
    );
};

export default TipsList;
