import { library } from '@fortawesome/fontawesome-svg-core';

// Official documentation available at: https://github.com/FortAwesome/vue-fontawesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faHome, faEnvelope, faHeart, faInfo, faList, faSpinner, faCodeBranch, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { faFontAwesome, faMicrosoft, faVuejs } from '@fortawesome/free-brands-svg-icons';

library.add(
    faHome, faEnvelope, faHeart, faInfo, faList, faSpinner, faCodeBranch, faDatabase,
    faFontAwesome, faMicrosoft, faVuejs
);

export {
    FontAwesomeIcon
};
