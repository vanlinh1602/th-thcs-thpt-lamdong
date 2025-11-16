import { useQueryClient } from '@tanstack/react-query';
import { ExternalLink, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent } from '@/components/ui/card';
import { useUserStore } from '@/features/user/hooks';

import { ThongKeChung } from './ThongKeChung';
import { TienDoBaoCao } from './TienDoBaoCao';
import { TienDoTungTruong } from './TienDoTungTruong';

const config = [
  {
    key: 'tienDoBaoCao',
    name: 'Tiến độ nhập báo cáo',
  },
  {
    key: 'tienDoTungTruong',
    name: 'Tiến độ từng trường',
  },
  {
    key: 'thongKeChung',
    name: 'Thống kê chung',
  },
];

export default function HomePage() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeReport, setActiveReport] = useState('tienDoBaoCao');

  const renderContent = () => {
    switch (activeReport) {
      case 'tienDoBaoCao':
        return <TienDoBaoCao />;
      case 'tienDoTungTruong':
        return <TienDoTungTruong />;
      case 'thongKeChung':
        return <ThongKeChung />;
    }
  };

  if (!user?.roles?.admin) {
    navigate('/reports');
    return null;
  }

  return (
    <div className="px-4 sm:px-2 pt-2 pb-14 mx-auto">
      <div className="text-2xl font-bold text-center">Thống kê báo cáo</div>
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <ButtonGroup className="divide-x-2 mt-2 flex-wrap">
          {config.map((item) => (
            <Button
              size="sm"
              variant={activeReport === item.key ? 'default' : 'outline'}
              onClick={() => setActiveReport(item.key)}
              key={item.key}
              value={item.key}
            >
              {item.name}
            </Button>
          ))}
        </ButtonGroup>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ['reports', 'summary'],
              });
            }}
          >
            <RefreshCcw className="h-4 w-4" />
            Làm mới
          </Button>
          <Button
            size="sm"
            className="mt-2"
            onClick={() => {
              navigate('/reports');
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Trang nhập liệu báo cáo
          </Button>
        </div>
      </div>

      <Card className="mt-2">
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
