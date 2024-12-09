import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiDuyeMuonSach, ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Modal, Popconfirm, Space, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ChiTietAnPham from '../AnPham/components/ChiTiet';
import CauHinhThoiHanMuonTra from './components/CauHinh';
import ChiTietMuonTraSach from './components/ChiTiet';
import DanhSachQuaHan from './components/DanhSachQuaHan';
import Form from './components/Form';

const MuonTraSachPage = () => {
	const { getModel, page, limit, handleView, handleEdit, deleteModel, getSettingModel, isView } =
		useModel('sachtailieu.muontra.muontra');
	const { handleView: handleViewAnPham, visibleForm, setVisibleForm } = useModel('sachtailieu.anpham.anpham');
	const [trangThai, setTrangThai] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.CHO_XU_LY);
	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);
	const [visibleQuaHan, setVisibleQuaHan] = useState<boolean>(false);

	useEffect(() => {
		getSettingModel();
	}, []);

	const getData = () => {
		getModel(
			trangThai === ETrangThaiMuonSach.CHO_XU_LY ? { trangThaiDuyet: ETrangThaiDuyeMuonSach.CHO_DUYET } : { trangThai },
		);
	};

	const onCell = (rec: MuonSach.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maDinhDanhNguoiMuon',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hotenNguoiMuon',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			width: 90,
			filterType: 'string',
			onCell,
			hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Nhan đề',
			dataIndex: 'anPhamId',
			width: 200,
			render: (val, rec) =>
				val ? (
					<ExpandText>
						<ButtonExtend
							size='small'
							type='link'
							icon={<InfoCircleOutlined />}
							onClick={(e) => {
								e.stopPropagation();
								handleViewAnPham(rec?.anPham);
							}}
						/>{' '}
						{rec?.anPham?.nhanDe}
					</ExpandText>
				) : (
					'Không có thông tin'
				),
			onCell,
		},
		{
			title: 'Thời gian mượn',
			dataIndex: 'thoiGianMuon',
			width: 150,
			render: (val, rec) => {
				if (!val) return null;

				const formattedTime = moment(val).format('HH:mm DD/MM/YYYY');
				const expiredDate = rec?.expired ? moment(rec.thoiGianMuon).add(rec.expired, 'days') : moment(rec.thoiGianMuon);

				const isOverdue = moment().isAfter(expiredDate);

				return (
					<span style={{ color: isOverdue ? 'red' : 'inherit', fontWeight: isOverdue ? 600 : 0 }}>{formattedTime}</span>
				);
			},
			filterType: 'date',
			sortable: true,
			onCell,
			hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},

		{
			title: 'Thời gian đăng ký',
			dataIndex: 'thoiGianDangKy',
			width: 150,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
			hide: trangThai !== ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Hạn trả',
			align: 'center',
			dataIndex: 'expired',
			width: 120,
			render: (val, rec) => val && moment(rec?.thoiGianMuon).add(val, 'days').format('DD/MM/YYYY'),
			onCell,
			hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Thời gian trả',
			dataIndex: 'thoiGianTra',
			width: 150,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			hide: trangThai !== ETrangThaiMuonSach.DA_TRA,
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Ghi chú trả',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
			hide: trangThai !== ETrangThaiMuonSach.DA_TRA,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend
						disabled={record?.trangThai === ETrangThaiMuonSach.DA_TRA}
						tooltip='Chỉnh sửa'
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id, getData)}
						title='Bạn có chắc chắn muốn xóa thông tin này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<Card
			title='Danh sách sinh viên mượn sách'
			extra={
				<ButtonExtend
					tooltip='Cấu hình'
					onClick={() => setVisibleCauHinh(true)}
					icon={<SettingOutlined />}
					type='link'
				/>
			}
		>
			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab as ETrangThaiMuonSach)}>
				{Object.values(ETrangThaiMuonSach).map((tab) => (
					<Tabs.TabPane key={tab} tab={tab} />
				))}
			</Tabs>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, trangThai]}
				modelName='sachtailieu.muontra.muontra'
				widthDrawer={900}
				formProps={{ getData, setTrangThai }}
				Form={isView ? ChiTietMuonTraSach : Form}
				hideCard
				otherButtons={
					trangThai === ETrangThaiMuonSach.DANG_THUE_MUON
						? [
								<Space key={'1'}>
									<ButtonExtend onClick={() => setVisibleQuaHan(true)}>Danh sách quá hạn</ButtonExtend>
								</Space>,
						  ]
						: []
				}
			/>

			<CauHinhThoiHanMuonTra visible={visibleCauHinh} setVisible={setVisibleCauHinh} />
			<DanhSachQuaHan visible={visibleQuaHan} setVisible={setVisibleQuaHan} />

			<Modal
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				width={1100}
				footer={null}
				bodyStyle={{ padding: 0 }}
			>
				<ChiTietAnPham />
			</Modal>
		</Card>
	);
};

export default MuonTraSachPage;
