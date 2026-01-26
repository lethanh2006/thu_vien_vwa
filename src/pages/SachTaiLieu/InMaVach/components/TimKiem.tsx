import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { CheckOutlined } from '@ant-design/icons';
import { type FormInstance } from 'antd';
import { useIntl, useModel } from 'umi';

const TimKiemInMaVach = (props: { field: string; form: FormInstance; setVisibleTimKiem: (val: boolean) => void }) => {
	const { field, form, setVisibleTimKiem } = props;
	const { page, limit } = useModel('sachtailieu.anpham.anpham');
	const { page: pageDKCB, limit: limitDKCB } = useModel('sachtailieu.anpham.anphamxepgia');
	const intl = useIntl();

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.maTaiLieu' }),
			dataIndex: 'maTaiLieu',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' }),
			dataIndex: 'nhanDe',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' }),
			dataIndex: 'tacGia',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.table.thaoTac' }),
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
					tooltip={intl.formatMessage({ id: 'global.button.xacnhan' })}
					className='text-success'
					type='link'
					icon={<CheckOutlined />}
				/>
			),
		},
	];

	const columnsĐKCB: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.maTaiLieu' }),
			dataIndex: ['anPham', 'maTaiLieu'],
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' }),
			dataIndex: ['anPham', 'nhanDe'],

			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' }),
			dataIndex: ['anPham', 'tacGia'],
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dkcb.soDangKyCaBiet' }),
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			filterType: 'string',
			width: 120,
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
			render: (val, rec) => rec?.thongTinXepGia?.donGia && `${inputFormat(rec?.thongTinXepGia?.donGia)} VNĐ`,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.table.thaoTac' }),
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
					tooltip={intl.formatMessage({ id: 'global.button.xacnhan' })}
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
