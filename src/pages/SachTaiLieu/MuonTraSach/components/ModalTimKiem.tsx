import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Card, Empty, message, Modal } from 'antd';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useModel } from 'umi';

const ModalTimKiem = (props: {
	visibleForm: boolean;
	setVisibleForm: (val: boolean) => void;
	vaiTro: EVaiTroMuonTra;
	slConMuonDuoc: number;
}) => {
	const intl = useIntl();
	const { visibleForm, setVisibleForm, vaiTro, slConMuonDuoc } = props;
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('40%');
	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};
	const { settingMuonTra } = useModel('sachtailieu.muontra.muontra');
	const { getModel, page, limit, record, setRecord } = useModel('sachtailieu.anpham.anpham');
	const { getModel: getModalDKCB, page: pageDKCB, limit: limitDKCB } = useModel('sachtailieu.anpham.anphamkhadung');
	const { danhSach, setDanhSach } = useModel('sachtailieu.anpham.anphamxepgia');

	const getDataExternal = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'search/kha-dung', {
			thoiGianBatDau: dayjs().toISOString(),
			thoiGianKetThuc: dayjs()
				.add(settingMuonTra?.thoiHanMuonTraSach ?? 150, 'd')
				.toISOString(),
		})
			.then((res: any) => setRecord(res?.[0]))
			.catch((err) => console.error('Error:', err));
	};

	const getData = () => {
		if (record?._id)
			getModalDKCB(undefined, undefined, undefined, undefined, undefined, `${record?._id}/kha-dung`, {
				thoiGianBatDau: dayjs().toISOString(),
				thoiGianKetThuc: dayjs()
					.add(settingMuonTra?.thoiHanMuonTraSach ?? 150, 'd')
					.toISOString(),
			});
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => setRecord(rec as any),
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--color-primary-bg)' : undefined,
		},
	});

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Mã tài liệu',
			dataIndex: 'maTaiLieu',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Nhan đề',
			dataIndex: 'nhanDe',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 150,
			filterType: 'string',
			onCell,
		},
	];

	const columnsĐKCB: IColumn<AnPham.IAnPhamXepGia>[] = [
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
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
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
						if (danhSach?.find((i) => i?._id === rec?._id)) {
							message.error('Ấn phẩm đã tồn tại trong danh sách!');
							return;
						}

						setDanhSach(
							(prev) =>
								[
									...prev,
									{
										...rec,
										thoiGianMuon: dayjs(),
										expired: dayjs().add(
											vaiTro === EVaiTroMuonTra.SINHVIEN
												? (settingMuonTra?.thoiHanMuonTraSach ?? 150)
												: (settingMuonTra?.thoiHanMuonTraSachCanBo ?? 7),
											'd',
										),
										ghiChu: danhSach?.length >= slConMuonDuoc ? 'Mượn vượt quá hạn ngạch cho phép' : '',
									},
								] as any,
						);
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
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			width={1000}
			footer={null}
			destroyOnHidden
		>
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='30%'>
					<Card title='Danh sách ấn phẩm' variant='borderless' styles={{ body: { padding: '8px 0 0' } }}>
						<TableBase
							getData={getDataExternal}
							columns={columns}
							dependencies={[page, limit, visibleForm]}
							modelName='sachtailieu.anpham.anpham'
							buttons={{ create: false }}
							hideCard
							otherProps={{ size: 'small' }}
						/>
					</Card>
				</Pane>

				<Pane minSize='30%'>
					{record?._id ? (
						<Card title='Danh sách đăng ký cá biệt' variant='borderless' styles={{ body: { padding: '8px 0 0' } }}>
							<TableBase
								getData={getData}
								columns={columnsĐKCB}
								dependencies={[pageDKCB, limitDKCB, record?._id, visibleForm]}
								modelName='sachtailieu.anpham.anphamkhadung'
								buttons={{ create: false }}
								hideCard
								otherProps={{ size: 'small' }}
							/>
						</Card>
					) : (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có thông tin ấn phẩm' />
					)}
				</Pane>
			</SplitPane>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default ModalTimKiem;
