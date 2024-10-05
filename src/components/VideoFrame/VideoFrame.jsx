import css from './VideoFrame.module.css';

export const VideoFrame = ({url}) => {

  return (
    <div className={css.wrapperFrame}>
      <iframe 
          title="Video player" 
          src={url} 
          width="100%" height="100%" 
          frameBorder="0" allow="autoplay" allowFullScreen
      />
    </div>            
  )
}