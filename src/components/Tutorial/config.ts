import { DriveStep } from 'driver.js';

export const tutorialConfig: Record<string, DriveStep[]> = {
  taomoi: [
    {
      popover: {
        title: 'Hướng dẫn tạo báo cáo mới',
        description:
          'Đây là hướng dẫn giúp thầy cô có thể tạo báo cáo mới một cách dễ dàng và nhanh chóng',
      },
    },
    {
      element: '#create-report',
      popover: {
        title: 'Tạo báo cáo mới',
        description:
          '<div style="white-space: pre-wrap;">' +
          [
            '- Bấm vào nút <b>"Thêm báo cáo"</b> để tạo báo cáo mới',
            '- Có thể thêm nhiều báo cáo, cho nhiều trường/nhóm lớp',
          ].join('\n') +
          '</div>',
        onNextClick: (_element, _step, { driver }) => {
          const createReport = document.getElementById('create-report');
          if (createReport) {
            createReport.click();
          }
          setTimeout(() => {
            driver.moveNext();
          }, 200);
        },
      },
    },
    {
      element: '#select_area',
      popover: {
        title: 'Chọn khu vực',
        description: 'Chọn khu vực của thầy/cô để tạo báo cáo',
      },
    },
    {
      element: '#select_ward',
      popover: {
        title: 'Chọn phường/xã',
        description: 'Chọn phường/xã của thầy/cô để tạo báo cáo',
      },
    },
    {
      element: '#select_school',
      popover: {
        title: 'Chọn trường',
        description: 'Chọn trường của thầy/cô để tạo báo cáo',
      },
    },
    {
      element: '#btn-create-report',
      popover: {
        title: 'Tạo báo cáo',
        description:
          '<div style="white-space: pre-wrap;">' +
          [
            'Bấm vào nút <b>"Xác nhận"</b> để tạo báo cáo mới',
            '<b>Lưu ý: Nếu trường nào đã có người nhập liệu (hệ thống sẽ không cho tạo nữa)</b>',
          ].join('\n') +
          '</div>',
        onNextClick: (_element, _step, { driver }) => {
          const closeButton = document.getElementById(
            'btn-close-create-report'
          );
          if (closeButton) {
            closeButton.click();
          }
          driver.moveNext();
        },
      },
    },
  ],
  nhaplieu: [
    {
      popover: {
        title: 'Hướng dẫn nhập liệu',
        description:
          'Đây là hướng dẫn giúp thầy cô có thể nhập liệu một cách dễ dàng và nhanh chóng',
        onNextClick: (_element, _step, { driver }) => {
          const reportsList = document.getElementById('reports-list');
          if (!reportsList) {
            driver.moveNext();
          }
          driver.moveNext();
        },
      },
    },
    {
      element: '#reports-list',
      popover: {
        title: 'Danh sách báo cáo',
        description:
          'Đây là danh sách các báo cáo, thầy/cô chọn báo cáo để nhập liệu',
      },
    },
    {
      element: '#child-reports-list',
      popover: {
        title: 'Danh sách các mẫu',
        description:
          'Đây là danh sách các mẫu trong báo cáo, thầy/cô chọn mẫu để nhập liệu',
      },
    },
    {
      element: '#form-input',
      popover: {
        title: 'Nhập liệu',
        description:
          'Thầy/cô nhập liệu vào các ô tương ứng trong form nhập liệu',
      },
    },
    {
      element: '#btn-save-temporary',
      popover: {
        title: 'Lưu tạm',
        description:
          'Bấm vào nút <b>"Lưu tạm"</b> để lưu báo cáo khi chưa nhập xong',
      },
    },
    {
      element: '#btn-send-report',
      popover: {
        title: 'Gửi báo cáo',
        description:
          'Bấm vào nút <b>"Gửi"</b> khi thầy cô đã nhập xong dữ liệu',
      },
    },
    {
      popover: {
        title: 'Lưu ý khi nhập liệu',
        description:
          '<div style="white-space: pre-wrap;">' +
          [
            '- Mỗi thông tin đều có nút <b>"Gửi"</b> (đã xong)',
            '- Thông tin nào xong, thì sẽ hiện <b style="color: green;">màu xanh</b>',
            '- Thông tin nào <b>Lưu tạm</b> thì sẽ hiển thị <b style="color: #f2e766;">màu vàng</b> và được hiểu là đang làm',
          ].join('\n') +
          '</div>',
      },
    },
  ],
};
