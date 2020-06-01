// https://github.com/FortAwesome/vue-fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faEnvelope, faHeart, faInfo, faList, faSpinner, faCodeBranch, faCheck, faBomb, faRocket, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { faFontAwesome, faMicrosoft, faVuejs, faLinkedin, faGithubAlt } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  // Solid
  faHome,
  faEnvelope,
  faHeart,
  faInfo,
  faList,
  faSpinner,
  faCodeBranch,
  faCheck,
  faBomb,
  faRocket,
  faLightbulb,

  // Brand
  faFontAwesome,
  faMicrosoft,
  faVuejs,
  faLinkedin,
  faGithubAlt
)

export {
  FontAwesomeIcon
}
