import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { Modal } from 'antd';
import { useIntl, useModel } from 'umi';

const ChiTietXepGia = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const { record: recXepGia } = useModel('sachtailieu.anpham.xepgia');
	const { getModel, page, limit } = useModel('sachtailieu.anpham.anphamxepgia');

	const getData = () => {
		if (recXepGia?._id) getModel({ thongTinXepGiaId: recXepGia?._id });
	};

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.dkcb' }),
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.thoiGianXepGia' }),
			dataIndex: 'thoiGianXepGia',
			align: 'center',
			width: 130,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.donGia' }),
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(recXepGia?.donGia ?? 0)} VNĐ`,
		},
	];

	return (
		<Modal
			title={intl.formatMessage({ id: 'sachtailieu.chiTietXepGia' })}
			open={visible}
			onCancel={() => setVisible(false)}
			width={800}
			footer={null}
		>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recXepGia?._id]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				hideCard
			/>
		</Modal>
	);
};

export default ChiTietXepGia;
