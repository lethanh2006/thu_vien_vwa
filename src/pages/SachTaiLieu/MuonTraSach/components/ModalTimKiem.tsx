import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Card, Modal } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useModel } from 'umi';

const ModalTimKiem = (props: {
	visibleForm: boolean;
	setVisibleForm: (val: boolean) => void;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { visibleForm, setVisibleForm, getData: getDataExternal } = props;
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('40%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const { page, limit, record, setRecord } = useModel('sachtailieu.anpham.thongtinanpham');
	const {
		getModel,
		page: pageDKCB,
		limit: limitDKCB,
		setRecord: setRecDKCB,
	} = useModel('sachtailieu.anpham.anphamxepgia');

	const getData = () => {
		if (record?._id) getModel({ anPhamId: record?._id });
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => setRecord(rec as any),
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--primary-1)' : undefined,
		},
	});

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Nhan đề',
			dataIndex: 'nhanDe',
			width: 180,
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 150,
			onCell,
		},
	];

	const columnsĐKCB: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
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
			render: (val, rec) => `${inputFormat(rec?.thongTinXepGia?.donGia ?? 0)} VNĐ`,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					onClick={() => {
						setRecDKCB(rec);
						setVisibleForm(false);
					}}
					tooltip='Xác nhận'
					className='text-success'
					type='link'
					icon={<CheckOutlined />}
				/>
			),
		},
	];

	return (
		<Modal
			title='Thông tin ấn phẩm tìm kiếm'
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			width={1000}
			footer={null}
		>
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='30%'>
					<Card
						title='Danh sách ấn phẩm'
						bordered={false}
						bodyStyle={{ padding: '8px 0 0' }}
						headStyle={{ padding: 0 }}
					>
						<TableBase
							getData={getDataExternal}
							columns={columns}
							dependencies={[page, limit]}
							modelName='sachtailieu.anpham.thongtinanpham'
							buttons={{ create: false }}
							hideCard
							otherProps={{ size: 'small' }}
						/>
					</Card>
				</Pane>

				<Pane minSize='30%'>
					<Card
						title='Danh sách đăng ký cá biệt'
						bordered={false}
						bodyStyle={{ padding: '8px 0 0' }}
						headStyle={{ padding: 0 }}
					>
						<TableBase
							getData={getData}
							columns={columnsĐKCB}
							dependencies={[pageDKCB, limitDKCB, record?._id]}
							modelName='sachtailieu.anpham.anphamxepgia'
							buttons={{ create: false }}
							hideCard
							otherProps={{ size: 'small' }}
						/>
					</Card>
				</Pane>
			</SplitPane>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default ModalTimKiem;
