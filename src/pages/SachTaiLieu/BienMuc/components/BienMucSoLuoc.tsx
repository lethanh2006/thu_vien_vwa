import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectCapThuMuc from '@/pages/DanhMuc/CapThuMuc/components/Select';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectNgonNgu from '@/pages/DanhMuc/DanhMucNgonNgu/components/Select';
import SelectKieuBanGhi from '@/pages/DanhMuc/KieuBanGhi/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import SelectVatMangTin from '@/pages/DanhMuc/VatMangTin/components/Select';
import SelectDotNhapSach from '@/pages/SachTaiLieu/DotNhapSach/components/Select';
import rules from '@/utils/rules';
import { Alert, Checkbox, Col, Form, type FormInstance, Input, Row, Select } from 'antd';
import { useIntl } from 'umi';

const BienMucSoLuoc = (props: { form: FormInstance }) => {
	const intl = useIntl();
	const { form } = props;
	const isSachHay: boolean = Form.useWatch('isSachHay', form);

	return (
		<Row gutter={[12, 0]}>
			<Col span={24}>
				<Alert
					style={{ marginBottom: 12 }}
					type='info'
					showIcon
					message={intl.formatMessage({ id: 'sachtailieu.label.noSave' })}
				/>
			</Col>
			<Col span={24}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Row gutter={[12, 0]}>
							<Col xs={24} md={6}>
								<Form.Item name='urlScanBia' label=''>
									<UploadFile
										isLandscapeAvatar
										buttonDescription={intl.formatMessage({ id: 'sachtailieu.bienmuc.themAnhBia' })}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={18}>
								<Row gutter={[12, 0]}>
									<Col xs={24} md={12}>
										<Form.Item
											name='dotNhapSachId'
											label={intl.formatMessage({ id: 'sachtailieu.anpham.soDangKyTongQuat' })}
										>
											<SelectDotNhapSach allowClear />
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item
											name='canBoBienMuc'
											label={intl.formatMessage({ id: 'sachtailieu.bienmuc.canBoBienMuc' })}
										>
											<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapCanBoBienMuc' })} />
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item
											name='maKieuBanGhi'
											label={intl.formatMessage({ id: 'sachtailieu.bienmuc.kieuBanGhi' })}
											rules={[...rules.required]}
										>
											<SelectKieuBanGhi selectMa />
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item
											name='maDangTaiLieu'
											label={intl.formatMessage({ id: 'sachtailieu.bienmuc.dangTaiLieu' })}
											rules={[...rules.required]}
										>
											<SelectDangTaiLieu selectMa />
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item
											name='maCapThuMuc'
											label={intl.formatMessage({ id: 'sachtailieu.bienmuc.capThuMuc' })}
											rules={[...rules.required]}
										>
											<SelectCapThuMuc selectMa />
										</Form.Item>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							name='maVatMangTin'
							label={intl.formatMessage({ id: 'sachtailieu.bienmuc.vatMangTin' })}
							rules={[...rules.required]}
						>
							<SelectVatMangTin selectMa />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='mauBienMucId'
							label={intl.formatMessage({ id: 'sachtailieu.bienmuc.mauBienMuc' })}
							rules={[...rules.required]}
						>
							<SelectMauBienMuc />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='doMat'
							label={intl.formatMessage({ id: 'sachtailieu.bienmuc.doMat' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.chonDoMat' })}
								style={{ width: '100%' }}
							>
								{Array.from({ length: 11 }, (_, i) => (
									<Select.Option key={i} value={i}>
										{i}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='maNgonNgu'
							label={intl.formatMessage({ id: 'sachtailieu.bienmuc.maNgonNgu' })}
							rules={[...rules.required]}
						>
							<SelectNgonNgu selectMa />
						</Form.Item>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='ISBN' label={intl.formatMessage({ id: 'sachtailieu.anpham.isbn' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapIsbn' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='ISSN' label={intl.formatMessage({ id: 'sachtailieu.anpham.issn' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapIssn' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='tacGia' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.tacGia' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapTacGia' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='nhanDe'
							label={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhanDeChinh' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapNhanDeChinh' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='soThuTuCuaTap' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.soThuTuCuaTap' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapSoThuTuCuaTap' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='tenTap' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.tenTap' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapTenTap' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='nhanDeSongSong' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhanDeSongSong' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapNhanDeSongSong' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='phuDe' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.phuDe' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapPhuDe' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='thongTinTrachNhiem'
							label={intl.formatMessage({ id: 'sachtailieu.bienmuc.thongTinTrachNhiem' })}
						>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapThongTinTrachNhiem' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name='lanXuatBan' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.lanXuatBan' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapLanXuatBan' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name='noiXuatBan' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.noiXuatBan' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapNoiXuatBan' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name='namXuatBan' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.namXuatBan' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapNamXuatBan' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='nhaXuatBan' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhaXuatBan' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapNhaXuatBan' })} />
						</Form.Item>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='soTrang' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.soTrang' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapSoTrang' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='dacDiemVatLy' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.dacDiemVatLy' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapDacDiemVatLy' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='khuonKho' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.khuonKho' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapKhuonKho' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='tuLieuDiKem' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.tuLieuDiKem' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapTuLieuDiKem' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='chiSoPhanLoai' label={intl.formatMessage({ id: 'sachtailieu.bienmuc.chiSoPhanLoai' })}>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhapChiSoPhanLoai' })} />
						</Form.Item>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='isSachHay' valuePropName='checked' initialValue={false}>
							<Checkbox>{intl.formatMessage({ id: 'sachtailieu.anpham.sachHay' })}</Checkbox>
						</Form.Item>
					</Col>
				</Row>
			</Col>

			{isSachHay && (
				<Col xs={24}>
					<Form.Item
						name='moTa'
						label={intl.formatMessage({ id: 'sachtailieu.anpham.noiDungSachHay' })}
						rules={[...rules.text]}
					>
						<TinyEditor height={300} hideMenubar miniToolbar stickyToolbar={false} />
					</Form.Item>
				</Col>
			)}
		</Row>
	);
};

export default BienMucSoLuoc;
