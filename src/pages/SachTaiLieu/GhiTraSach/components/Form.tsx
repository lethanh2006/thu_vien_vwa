import { ETrangThaiMuonSach, EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import { colorTrangThaiHocSv, type ETrangThaiHocSv } from '@/services/SinhVien/constant';
import type { SinhVien } from '@/services/SinhVien/typings';
import { type ETrangThaiNhanSu, MapColorETrangThaiNhanSu } from '@/services/ToChucNhanSu/constant';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Form, Input, message, Row, Segmented, Space, Spin, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import LichSuThueMuonPage from '../../MuonTraSach/LichSu';
import GhiTraAnPham from '../../MuonTraSach/components/GhiTraSach';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';

const FormGhiTraSach = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();

	const { getModel, loading, visibleForm, setVisibleForm, setRecord } = useModel('sachtailieu.muontra.muontra');
	const [recSinhVien, setRecSinhVien] = useState<SinhVien.IRecord>();
	const [recCanBo, setRecCanBo] = useState<ToChucNhanSu.INhanSu>();
	const [visibleGhiTra, setVisibleGhiTra] = useState<boolean>(false);
	const dkcb: string = Form.useWatch('dkcb', form);
	const soThe: string = Form.useWatch('soThe', form);
	const vaiTro: EVaiTroMuonTra = Form.useWatch('vaiTro', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setRecSinhVien({} as SinhVien.IRecord);
			setRecCanBo({} as ToChucNhanSu.INhanSu);
		} else {
			form.setFieldsValue({ vaiTro: EVaiTroMuonTra.SINHVIEN });
		}
	}, [visibleForm]);

	const handleLuuDKCB = async () => {
		if (!dkcb) {
			message.error('Vui lòng nhập đăng ký cá biệt trước khi thêm!');
			return;
		}

		const anPhamData = await getModel(
			{ soDangKyCaBiet: dkcb, trangThai: ETrangThaiMuonSach.DANG_THUE_MUON },
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			false,
		);

		if (!anPhamData?.length) {
			message.error('Không tìm thấy ấn phẩm!');
			return;
		}

		setRecord(anPhamData?.[0]);
		setVisibleGhiTra(true);
	};

	const handleLuuSinhVien = async () => {
		const nguoiMuon = await getModel(
			vaiTro === EVaiTroMuonTra.SINHVIEN ? ({ ma: soThe } as any) : ({ maCanBo: soThe } as any),
			undefined,
			undefined,
			undefined,
			undefined,
			`thong-ke/${vaiTro === EVaiTroMuonTra.SINHVIEN ? 'sinh-vien' : 'can-bo'}`,
			undefined,
			false,
		);

		if (!nguoiMuon?.length) {
			message.error('Không tìm thấy người mượn!');
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		vaiTro === EVaiTroMuonTra.SINHVIEN ? setRecSinhVien(nguoiMuon?.[0] as any) : setRecCanBo(nguoiMuon?.[0] as any);
	};

	useEffect(() => {
		if (soThe) handleLuuSinhVien();
	}, [soThe]);

	return (
		<Card title='Ghi trả sinh viên mượn sách'>
			<Form form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={6}>
						<Row gutter={[12, 0]}>
							<Col span={24}>
								<Form.Item name='vaiTro'>
									<Segmented
										options={Object.values(EVaiTroMuonTra)?.map((item) => ({
											value: item,
											label: item,
										}))}
										onChange={() => form.resetFields(['soThe'])}
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name='soThe' label={vaiTro === EVaiTroMuonTra.SINHVIEN ? 'Mã sinh viên' : 'Mã cán bộ'}>
									{vaiTro === EVaiTroMuonTra.SINHVIEN ? (
										<SelectSinhVienDebounce selectMa />
									) : (
										<SelectNhanSuDebounce selectMa />
									)}
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name='dkcb' label='Đăng ký cá biệt'>
									<Input
										placeholder='Nhập đăng ký cá biệt'
										onPressEnter={(e) => {
											e.preventDefault();
											handleLuuDKCB();
										}}
									/>
								</Form.Item>
								<Space>
									<a type='link' onClick={handleLuuDKCB}>
										Ghi trả
									</a>
								</Space>
							</Col>
						</Row>
					</Col>

					<Col span={24} md={18}>
						<Row gutter={[12, 0]}>
							<Col span={24}>
								<Spin spinning={loading}>
									<Descriptions
										column={{ xs: 1, sm: 1, md: 2 }}
										bordered
										style={{ marginBottom: 18 }}
										title='Thông tin người mượn'
									>
										{vaiTro === EVaiTroMuonTra.SINHVIEN ? (
											<>
												<Descriptions.Item label='Mã SV'>{recSinhVien?.ma ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Họ tên'>{recSinhVien?.ten ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Ngày sinh'>
													{recSinhVien?.ngaySinh ? moment(recSinhVien?.ngaySinh).format('DD/MM/YYYY') : '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Lớp'>{recSinhVien?.tenLopHanhChinhVirtual ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Khóa sinh viên'>
													{recSinhVien?.khoaSinhVien?.ten ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Khóa ngành'>{recSinhVien?.khoaNganh?.ten ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Trạng thái học'>
													<Tag color={colorTrangThaiHocSv[recSinhVien?.trangThaiHoc as ETrangThaiHocSv]}>
														{recSinhVien?.trangThaiHoc ?? '--'}
													</Tag>
												</Descriptions.Item>
											</>
										) : (
											<>
												<Descriptions.Item label='Mã cán bộ'>{recCanBo?.maCanBo ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Họ tên'>
													{[recCanBo?.hoDem, recCanBo?.ten]?.filter(Boolean).join(' ')}
												</Descriptions.Item>
												<Descriptions.Item label='Ngày sinh'>
													{recCanBo?.ngaySinh ? moment(recCanBo?.ngaySinh).format('DD/MM/YYYY') : '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Đơn vị'>{recCanBo?.donViChinh?.ten ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Trạng thái'>
													<Tag color={MapColorETrangThaiNhanSu[recCanBo?.trangThai as ETrangThaiNhanSu]}>
														{recCanBo?.trangThai ?? '--'}
													</Tag>
												</Descriptions.Item>
											</>
										)}
									</Descriptions>
								</Spin>
							</Col>

							<Col span={24}>
								<div className='fw500' style={{ marginTop: 12 }}>
									Danh sách ấn phẩm đang mượn
								</div>

								<LichSuThueMuonPage
									ssoId={vaiTro === EVaiTroMuonTra.SINHVIEN ? recSinhVien?.ssoId : recCanBo?.ssoId}
									isGhiTra
									hideModal
									getData={getData}
								/>
							</Col>
						</Row>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>

			<GhiTraAnPham visible={visibleGhiTra} setVisible={setVisibleGhiTra} getData={getData} isThongTin />
		</Card>
	);
};

export default FormGhiTraSach;
