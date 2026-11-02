# 문구 수정 방법

1. `content.js`를 엽니다. GitHub에서는 연필 버튼을 누르세요.
2. 한국어 주석 아래에서 바꿀 문장을 찾습니다(Ctrl+F).
3. 오른쪽 큰따옴표 안의 내용만 수정합니다. 쉼표와 항목 이름은 유지합니다.
4. Commit changes를 누르면 GitHub Pages에 반영됩니다.

- `top`은 메인 제목·익명 저자 문구, `situation`은 상황·데모 설명, `how`는 Method, `code`는 코드 설명입니다.
- 문장 안 큰따옴표는 `\"`, 줄바꿈은 `\n`으로 씁니다.
- 링크는 파일 아래쪽 `links`의 `href`를 바꿉니다. `#demo`, `#how`, `#code`는 페이지 내 이동입니다.
- 결과 수치·동영상 경로·동적으로 생성되는 표는 `assets/results.js`와 `assets/app.js`에 보존했습니다. 과학적 내용의 실수 방지를 위해 일반 문구 편집과 분리했습니다.
- 그림 교체는 `assets/method.png`를 같은 이름으로 덮어씁니다.
- 디자인은 `assets/styles.css`에 있습니다.
- 기존 익명 문구는 자동 삭제하지 않았습니다. 공개용에서 원하는 저자·소속으로 바꾸세요.

# 업로드 방법

이 ZIP에는 사용자가 첨부한 HTML에서 추출한 파일만 있습니다. 기존 `videos/`와 `code.zip`은 포함되지 않습니다.

GitHub 기존 저장소의 최상위에 `index.html`, `content.js`, `assets/`, `.nojekyll`을 업로드하세요. 기존 `videos/`와 `code.zip`은 그대로 유지하세요. ZIP 파일 자체를 올리지 마세요.

Netlify에 올릴 경우에는 기존 `videos/`, `code.zip`까지 이 폴더에 합쳐 전체를 배포해야 합니다.

처음에는 전체 파일을 올리고, 이후 문구 변경은 `content.js`만 수정하면 됩니다. 기본 문구는 원본과 동일합니다.
