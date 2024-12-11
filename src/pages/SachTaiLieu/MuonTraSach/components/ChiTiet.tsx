import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiDuyeMuonSach,
	colorTrangThaiMuonSach,
	ETrangThaiDuyeMuonSach,
	ETrangThaiMuonSach,
} from '@/services/SachTaiLieu/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Form, Input, message, Popconfirm, Row, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import GhiTraAnPham from './GhiTraSach';

const ChiTietMuonTraSach = (props: any) => {
	const { getData: getDataExternal } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, visibleForm, xuLyThueMuonAnPhamModel } = useModel('sachtailieu.muontra.muontra');
	const { getModel, page, limit, setDanhSach, selectedIds, setSelectedIds } = useModel(
		'sachtailieu.anpham.thongtinanpham',
	);
	const [visibleGhiTra, setVisibleGhiTra] = useState<boolean>(false);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedIds([]);
		}
		setDanhSach([]);
	}, [record?._id, visibleForm]);

	const getData = () => {
		if (record?.anPhamId) getModel({ anPhamId: record?.anPhamId });
	};

	const columns: IColumn<AnPham.IThongTinAnPham>[] = [
		{
			title: 'Ấn phẩm',
			dataIndex: 'anPhamId',
			width: 120,
			render: (val, rec) => rec?.anPham?.ten ?? 'Không có thông tin',
		},
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => rec?.anPham?.tacGia,
		},
		{
			title: 'Nhãn',
			width: 80,
			render: (val, rec) => rec?.tagCode,
		},
	];

	const onFinish = async (values: any) => {
		if (!selectedIds?.length) {
			message.error('Vui lòng chọn thông tin ấn phẩm cho mượn!');
			return;
		}
		const data = {
			danhSachThongTinAnPhamId: selectedIds,
			trangThaiDuyet: ETrangThaiDuyeMuonSach.DA_DUYET,
			ghiChu: values.ghiChu,
		};
		xuLyThueMuonAnPhamModel(record?._id ?? '', data as any, getDataExternal)
			.then(() => {
				setVisibleForm(false);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Card title='Chi tiết sinh viên mượn sách'>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Descriptions column={1}>
						<Descriptions.Item label='Mã sinh viên'>{record?.maDinhDanhNguoiMuon ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Họ tên'>{record?.hotenNguoiMuon ?? '--'}</Descriptions.Item>
						{record?.anPhamId ? (
							<>
								<Descriptions.Item label='Ấn phẩm'>{record?.anPham?.ten ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Nhan đề'>{record?.anPham?.nhanDe ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Tác giả'>{record?.anPham?.tacGia ?? '--'}</Descriptions.Item>
							</>
						) : null}
						{record?.thongTinAnPhamId ? (
							<Descriptions.Item label='Thông tin ấn phẩm'>
								{record?.thongTinAnPham?.tagCode}
								{record?.thongTinAnPham?.value
									? record?.thongTinAnPham?.value
									: record?.thongTinAnPham?.danhSachThuocTinhAnPham
											?.map((item) => `${item?.code} - ${item?.value}`)
											.join(', ')}
							</Descriptions.Item>
						) : null}
						{record?.trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ||
						record?.trangThai === ETrangThaiMuonSach.DA_TRA ? (
							<>
								<Descriptions.Item label='Đăng ký cá biệt'>{record?.soDangKyCaBiet ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Thời gian mượn'>
									{record?.thoiGianMuon ? moment(record?.thoiGianMuon).format('HH:mm DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Hạn trả'>
									{record?.expired ? `${record?.expired} ngày` : '--'}
								</Descriptions.Item>
								{record?.trangThai === ETrangThaiMuonSach.DA_TRA ? (
									<Descriptions.Item label='Thời gian trả'>
										{record?.thoiGianTra ? moment(record?.thoiGianTra).format('HH:mm DD/MM/YYYY') : '--'}
									</Descriptions.Item>
								) : null}

								<Descriptions.Item label='Trạng thái'>
									<Tag color={colorTrangThaiMuonSach[record?.trangThai as ETrangThaiMuonSach]}>{record?.trangThai}</Tag>
								</Descriptions.Item>
							</>
						) : null}
						<Descriptions.Item label='Trạng thái duyệt'>
							<Tag color={colorTrangThaiDuyeMuonSach[record?.trangThaiDuyet as ETrangThaiDuyeMuonSach]}>
								{record?.trangThaiDuyet}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item label='Thời gian đăng ký'>
							{record?.thoiGianDangKy ? moment(record?.thoiGianDangKy).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>
					</Descriptions>
				</Col>
				{record?.trangThai === ETrangThaiMuonSach.CHO_XU_LY ||
				record?.trangThaiDuyet === ETrangThaiDuyeMuonSach.CHO_DUYET ? (
					<Col xs={24}>
						<Form onFinish={onFinish} form={form} layout='vertical'>
							<Col xs={24}>
								<TableBase
									getData={getData}
									columns={columns}
									dependencies={[page, limit, record?._id]}
									modelName='sachtailieu.anpham.thongtinanpham'
									buttons={{ create: false }}
									hideCard
									otherProps={{
										rowKey: (rec: AnPham.IThongTinAnPham) => rec._id,
										rowSelection: {
											type: 'checkbox',
											selectedRowKeys: selectedIds,
											preserveSelectedRowKeys: true,
											onChange: (selectedRowKeys: string[]) => {
												setSelectedIds(selectedRowKeys.slice(-1));
											},
											columnWidth: 40,
											hideSelectAll: true,
										},
									}}
								/>
							</Col>
							<Col xs={24}>
								<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
									<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
								</Form.Item>
							</Col>
						</Form>
					</Col>
				) : null}
			</Row>

			<div className='form-footer'>
				{record?.trangThai === ETrangThaiMuonSach.CHO_XU_LY ||
				record?.trangThaiDuyet === ETrangThaiDuyeMuonSach.CHO_DUYET ? (
					<Popconfirm
						onConfirm={() => form.submit()}
						title='Bạn có chắc chắn muốn xác nhận cho mượn thông tin ấn phẩm này?'
						placement='topRight'
					>
						<ButtonExtend className='text-success' onClick={() => {}}>
							Duyệt
						</ButtonExtend>
					</Popconfirm>
				) : null}

				{record?.trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? (
					<ButtonExtend
						className='text-success'
						onClick={() => {
							setVisibleForm(false);
							setVisibleGhiTra(true);
						}}
					>
						Ghi trả
					</ButtonExtend>
				) : null}

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>

			<GhiTraAnPham visible={visibleGhiTra} setVisible={setVisibleGhiTra} getData={getDataExternal} />
		</Card>
	);
};

export default ChiTietMuonTraSach;
