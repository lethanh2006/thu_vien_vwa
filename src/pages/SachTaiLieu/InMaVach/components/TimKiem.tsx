import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { CheckOutlined } from '@ant-design/icons';
import { type FormInstance } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const TimKiemInMaVach = (props: { field: string; form: FormInstance; setVisibleTimKiem: (val: boolean) => void }) => {
	const { field, form, setVisibleTimKiem } = props;
	const { page, limit } = useModel('sachtailieu.anpham.anpham');
	const { page: pageDKCB, limit: limitDKCB } = useModel('sachtailieu.anpham.anphamxepgia');

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Mã tài liệu',
			dataIndex: 'maTaiLieu',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Nhan đề',
			dataIndex: 'nhanDe',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					onClick={() => {
						form.setFieldsValue({
							[field]: rec?.maTaiLieu,
						});
						setVisibleTimKiem(false);
					}}
					tooltip='Xác nhận'
					className='text-success'
					type='link'
					icon={<CheckOutlined />}
				/>
			),
		},
	];

	const columnsĐKCB: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: 'Mã tài liệu',
			dataIndex: ['anPham', 'maTaiLieu'],
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Nhan đề',
			dataIndex: ['anPham', 'nhanDe'],

			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Tác giả',
			dataIndex: ['anPham', 'tacGia'],
			width: 150,
			filterType: 'string',
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			filterType: 'string',
			width: 120,
		},
		{
			title: 'Thời gian xếp giá',
			dataIndex: 'thoiGianXepGia',
			align: 'center',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Đơn giá',
			width: 120,
			align: 'right',
			render: (val, rec) => rec?.thongTinXepGia?.donGia && `${inputFormat(rec?.thongTinXepGia?.donGia)} VNĐ`,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					onClick={() => {
						form.setFieldsValue({
							[field]: rec?.soDangKyCaBiet,
						});
						setVisibleTimKiem(false);
					}}
					tooltip='Xác nhận'
					className='text-success'
					type='link'
					icon={<CheckOutlined />}
				/>
			),
		},
	];

	if (field === 'tuMaTaiLieu' || field === 'denMaTaiLieu') {
		return (
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='sachtailieu.anpham.anpham'
				buttons={{ create: false }}
				hideCard
				otherProps={{ size: 'small' }}
			/>
		);
	}
	if (field === 'tudkcb' || field === 'dendkcb') {
		return (
			<TableBase
				columns={columnsĐKCB}
				dependencies={[pageDKCB, limitDKCB]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				hideCard
				otherProps={{ size: 'small' }}
			/>
		);
	}

	return null;
};

export default TimKiemInMaVach;
