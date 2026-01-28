import MyDatePicker from '@/components/MyDatePicker';
import { EThuTrongTuan, mapNameThuTrongTuan } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Divider, Form, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCauHinhVaoRaThuVien = (props: any) => {
	const intl = useIntl();
	const { getData, danhSach } = props;
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, record, edit } = useModel('quanlythuvien.cauhinh');
	const { formSubmiting, postCauHinhThuVienModel } = useModel('quanlythuvien.vaorathuvien');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record) {
			form.setFieldsValue(record);
		}
	}, [record, visibleForm]);

	const onFinish = async (values: QuanLyThuVien.ICauHinhVaoRaThuVien) => {
		const filteredThoiGian = danhSach?.thoiGian?.filter((item: any) => item?.thu !== values?.thu) || [];

		const updatedThoiGian = [...filteredThoiGian, values];

		const data = {
			thoiGian: updatedThoiGian,
		};

		postCauHinhThuVienModel(data as any, getData)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Row gutter={[12, 0]}>
				<Col xs={24} md={24}>
					<Form.Item
						name='thu'
						label={intl.formatMessage({ id: 'vaorathuvien.label.thu' })}
						rules={[...rules.required]}
					>
						<Select
							disabled={edit}
							options={(!edit
								? Object.values(EThuTrongTuan).filter(
										(item) => !danhSach?.thoiGian?.map((items: any) => items?.thu).includes(Number(item)),
									)
								: Object.values(EThuTrongTuan)
							)?.map((item) => ({
								value: Number(item),
								label: mapNameThuTrongTuan[String(item) as EThuTrongTuan],
							}))}
							placeholder={intl.formatMessage({ id: 'vaorathuvien.label.chonThu' })}
						/>
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Divider orientation='left'>{intl.formatMessage({ id: 'vaorathuvien.label.sang' })}</Divider>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianMoCuaBuoiSang'
						label={intl.formatMessage({ id: 'vaorathuvien.label.thoiGianMoCuaBuoiSang' })}
						rules={[...rules.required]}
					>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder={intl.formatMessage({ id: 'vaorathuvien.label.chonThoiGian' })}
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianDongCuaBuoiSang'
						label={intl.formatMessage({ id: 'vaorathuvien.label.thoiGianDongCuaBuoiSang' })}
						rules={[...rules.required]}
					>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder={intl.formatMessage({ id: 'vaorathuvien.label.chonThoiGian' })}
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Divider orientation='left'>{intl.formatMessage({ id: 'vaorathuvien.label.chieu' })}</Divider>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianMoCuaBuoiChieu'
						label={intl.formatMessage({ id: 'vaorathuvien.label.thoiGianMoCuaBuoiChieu' })}
						rules={[...rules.required]}
					>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder={intl.formatMessage({ id: 'vaorathuvien.label.chonThoiGian' })}
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianDongCuaBuoiChieu'
						label={intl.formatMessage({ id: 'vaorathuvien.label.thoiGianDongCuaBuoiChieu' })}
						rules={[...rules.required]}
					>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder={intl.formatMessage({ id: 'vaorathuvien.label.chonThoiGian' })}
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Divider orientation='left'>{intl.formatMessage({ id: 'vaorathuvien.label.toi' })}</Divider>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianMoCuaBuoiToi'
						label={intl.formatMessage({ id: 'vaorathuvien.label.thoiGianMoCuaBuoiToi' })}
						rules={[...rules.required]}
					>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder={intl.formatMessage({ id: 'vaorathuvien.label.chonThoiGian' })}
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianDongCuaBuoiToi'
						label={intl.formatMessage({ id: 'vaorathuvien.label.thoiGianDongCuaBuoiToi' })}
						rules={[...rules.required]}
					>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder={intl.formatMessage({ id: 'vaorathuvien.label.chonThoiGian' })}
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{edit
						? intl.formatMessage({ id: 'global.button.luulai' })
						: intl.formatMessage({ id: 'global.button.themmoi' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormCauHinhVaoRaThuVien;
