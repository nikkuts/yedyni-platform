export const insertContent = ({
    courseId,
    lessonId,
    elem,
    content,
    navigate
}) => {    
    elem.innerHTML = `${content}`;

    const theoryBtn = elem.querySelector("#theory");
    const practiceBtn = elem.querySelector("#practice");
    const audioBtn = elem.querySelector("#audio");
    const videoBtn = elem.querySelector("#video");
    const testBtn = elem.querySelector("#test");
    const diaryBtn = elem.querySelector("#diary");

    if (theoryBtn) {
        theoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigate(`/uk/learn/${courseId}/${lessonId}/theory`);
        });
    }

    if (practiceBtn) {
        practiceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigate(`/uk/learn/${courseId}/${lessonId}/practice`);
        });
    }

    if (audioBtn) {
        audioBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigate(`/uk/learn/${courseId}/${lessonId}/audio`);
        });
    }

    if (videoBtn) {
        videoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigate(`/uk/learn/${courseId}/${lessonId}/video`);
        });
    }

    if (testBtn) {
        testBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigate(`/uk/learn/${courseId}/${lessonId}/test`);
        });
    }

    if (diaryBtn) {
        diaryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigate(`/uk/learn/${courseId}/${lessonId}/diary`);
        });
    }
};