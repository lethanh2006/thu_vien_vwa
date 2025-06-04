import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, message, Modal, Steps } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import BienMucChiTietZ3950 from '../../components/BienMucChiTiet';
import BienMucSoLuocZ3950 from '../../components/BienMucSoLuoc';
import ButtonExtend from '@/components/Table/ButtonExtend';

const FormZ3950 = (props: { visibleForm: boolean; setVisibleForm: (val: boolean) => void }) => {
	const { setVisibleForm, visibleForm } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, formSubmiting, setFormSubmiting, postBienMucSoLuocModel, putBienMucChiTietModel, setVisibleZ3950 } =
		useModel('sachtailieu.anpham.anpham');
	const { danhSach, getAllModel } = useModel('danhmuc.truongbienmuc');
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [actionType, setActionType] = useState<ETrangThaiBienMuc>(ETrangThaiBienMuc.CHO_BIEN_MUC);

	useEffect(() => {
		getAllModel(undefined, undefined, undefined, undefined, undefined, undefined, undefined, {
			population: [
				{
					path: 'thuocTinh',
				},
			],
		});
	}, []);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else {
			const fieldMapping = {
				ISBN: { tagCode: '020', subCode: '$a' },
				ISSN: { tagCode: '022', subCode: '$a' },
				tacGia: { tagCode: '100', subCode: '$a' },
				nhanDe: { tagCode: '245', subCode: '$a' },
				soThuTuCuaTap: { tagCode: '245', subCode: '$n' },
				tenTap: { tagCode: '245', subCode: '$p' },
				nhanDeSongSong: { tagCode: '245', subCode: '$b' },
				phuDe: { tagCode: '245', subCode: '$b' },
				thongTinTrachNhiem: { tagCode: '245', subCode: '$c' },
				lanXuatBan: { tagCode: '250', subCode: '$a' },
				noiXuatBan: { tagCode: '260', subCode: '$a' },
				namXuatBan: { tagCode: '260', subCode: '$c' },
				nhaXuatBan: { tagCode: '260', subCode: '$b' },
				soTrang: { tagCode: '300', subCode: '$a' },
				dacDiemVatLy: { tagCode: '300', subCode: '$b' },
				khuonKho: { tagCode: '300', subCode: '$c' },
				tuLieuDiKem: { tagCode: '300', subCode: '$e' },
				maNgonNgu: { tagCode: '041', subCode: '$a' },
			};

			const formValues: Record<string, any> = {};
			Object.entries(fieldMapping).forEach(([fieldName, { tagCode, subCode }]) => {
				const tag = record?.danhSachThongTin?.find((item) => item?.tagCode === tagCode);
				let value = tag?.thuocTinhAnPham?.find((i) => i.code === subCode)?.value;

				// Gán giá trị mặc định từ `record` nếu không tìm thấy giá trị từ `tag`
				if (!value && (fieldName === 'tacGia' || fieldName === 'nhanDe')) {
					value = record?.[fieldName];
				}

				if (value) {
					formValues[fieldName] = value;
				}
			});

			const mergedData = record?.danhSachThongTin?.map((item) => ({
				...item,
				ten: danhSach?.find((i) => i?.ma === item?.tagCode)?.noiDung,
				thuocTinhAnPham: [
					...(item?.thuocTinhAnPham || []).map((tp) => ({
						...tp,
						value: tp.value ?? null,
						ten: danhSach?.find((i) => i?.ma === item?.tagCode)?.thuocTinh?.find((i) => i?.code === tp?.code)?.tieuDe,
					})),
				],
			}));

			// Gán giá trị cho form
			form.setFieldsValue({
				...record,
				...formValues,
				danhSachBienMucChiTiet: _.orderBy(mergedData, 'tagCode'),
			});
		}
	}, [record, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			setFormSubmiting(true);

			const urlScanBia = await buildUpLoadFile(values, 'urlScanBia').finally(() => setFormSubmiting(false));
			values.urlScanBia = urlScanBia ?? '';
			values.namXuatBan = Number(values.namXuatBan);

			// Tách riêng dữ liệu cho biên mục sơ lược (không bao gồm danhSachBienMucChiTiet)
			const { danhSachBienMucChiTiet, ...bienMucSoLuocData } = values;

			// Gửi biên mục sơ lược
			const res = await postBienMucSoLuocModel({
				...bienMucSoLuocData,
				trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC,
			});

			const newRecordId = res?._id;
			if (!newRecordId) throw new Error('Không nhận được _id từ biên mục sơ lược');

			// Chỉ gửi danhSachBienMucChiTiet khi gọi putBienMucChiTietModel
			if (danhSachBienMucChiTiet) {
				const data = {
					danhSachBienMucChiTiet: danhSachBienMucChiTiet.map((item: any) => ({
						_id: item._id ?? null,
						ind1: item.ind1 ?? null,
						ind2: item.ind2 ?? null,
						tagCode: item.tagCode,
						value: item.value ?? null,
						thuocTinhAnPham: (item.thuocTinhAnPham || []).map((thuocTinh: any) => ({
							code: thuocTinh.code,
							value: thuocTinh.value ?? '',
						})),
					})),
					trangThai: actionType,
				};

				// Gửi biên mục chi tiết
				await putBienMucChiTietModel(newRecordId, data);
			}
		} catch (error: any) {
			console.log('🚀 ~ onFinish ~ error:', error);
		}
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			await onFinish(values).then(() => {
				setVisibleForm(false);
				setVisibleZ3950(false);
				if (actionType === ETrangThaiBienMuc.DA_BIEN_MUC) {
					history.push('/sach-tai-lieu/an-pham');
				}
			});
		} catch (error) {
			const errorFields = (error as any).errorFields;

			if (errorFields && errorFields.length > 0) {
				message.error('Vui lòng kiểm tra lại các trường bắt buộc');
			} else {
				message.error('Có lỗi xảy ra khi kiểm tra dữ liệu');
			}
		}
	};

	const handleNext = async () => {
		try {
			await form.validateFields();
			setCurrentStep(currentStep + 1);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handlePrev = () => {
		setCurrentStep(currentStep - 1);
	};

	return (
		<Modal
			title='Biên mục qua Z39.50'
			width={1200}
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Steps
					current={currentStep}
					type='navigation'
					style={{ marginBottom: 18, paddingTop: 0 }}
					onChange={setCurrentStep}
				>
					<Steps.Step title='Biên mục sơ lược' />
					<Steps.Step title='Biên mục chi tiết' />
				</Steps>

				<div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
					<BienMucSoLuocZ3950 form={form} />
				</div>
				<div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
					<BienMucChiTietZ3950 form={form} />
				</div>

				<div className='form-footer'>
					{currentStep === 0 ? (
						<>
							<Button onClick={handleNext} type='primary'>
								Tiếp tục
							</Button>
							<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
						</>
					) : (
						<>
							<Button onClick={handlePrev}>Quay lại</Button>
							<ButtonExtend
								tooltip='Nếu lưu lại ấn phẩm sẽ ở vẫn trạng thái chờ biên mục chi tiết'
								loading={formSubmiting}
								type='primary'
								onClick={() => {
									setActionType(ETrangThaiBienMuc.CHO_BIEN_MUC);
									handleSubmit();
								}}
							>
								Lưu lại
							</ButtonExtend>
							<ButtonExtend
								tooltip='Nếu hoàn thành ấn phẩm sẽ chuyển trạng thái đã biên mục chi tiết'
								loading={formSubmiting}
								type='primary'
								onClick={() => {
									setActionType(ETrangThaiBienMuc.DA_BIEN_MUC);
									handleSubmit();
								}}
							>
								Hoàn thành
							</ButtonExtend>
							<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
						</>
					)}
				</div>
			</Form>
		</Modal>
	);
};

export default FormZ3950;
