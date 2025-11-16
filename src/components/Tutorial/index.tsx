import 'driver.js/dist/driver.css';

import { driver } from 'driver.js';
import { CircleQuestionMark } from 'lucide-react';
import { useCallback } from 'react';

import { tutorialConfig } from './config';

type Props = {
  type: 'taomoi' | 'nhaplieu';
};

export const Tutorial = ({ type }: Props) => {
  const startTutorial = useCallback(() => {
    const config = tutorialConfig[type];
    const driverObj = driver({
      animate: true,
      nextBtnText: 'Tiếp theo',
      prevBtnText: 'Trước đó',
      doneBtnText: 'Đóng',
      showProgress: true,
      allowKeyboardControl: true,
      allowClose: false,
      onDestroyed: () => {
        const stored = localStorage.getItem('showTutorial');
        const parsed = stored ? JSON.parse(stored) : {};
        localStorage.setItem(
          'showTutorial',
          JSON.stringify({ ...parsed, [type]: true })
        );
      },
      steps: config,
    });
    driverObj.drive();
  }, [type]);

  // useEffect(() => {
  //   const showTutorial = localStorage.getItem('showTutorial');
  //   if (showTutorial) {
  //     const config = JSON.parse(showTutorial);
  //     if (!config?.[type]) {
  //       startTutorial();
  //     }
  //   } else {
  //     startTutorial();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div
      className="flex items-center gap-2 text-blue-400 cursor-pointer"
      onClick={startTutorial}
    >
      <CircleQuestionMark className="w-4 h-4" />
      <p>Hướng dẫn sử dụng</p>
    </div>
  );
};
