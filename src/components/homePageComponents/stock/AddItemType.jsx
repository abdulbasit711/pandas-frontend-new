/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../../features/config';
import Button from '../../Button';
import Loader from '../../../pages/Loader';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../Input';
import { setTypeData } from '../../../store/slices/products/typeSlice'


const AddItemType = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [isButtonLoading, setIsButtonLoading] = useState(false)
    const [isTypeCreated, setIsTypeCreated] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [error, setError] = useState('')
    const [typeId, setTypeId] = useState('')
    const [typeName, setTypeName] = useState('')

    const typeData = useSelector((state) => state.types.typeData);

    const dispatch = useDispatch()

    // Dummy Types Data
    const dummyTypesData = [
        {
            _id: "type_001",
            typeName: "Retail",
            typeDescription: "Standard retail products",
            createdAt: new Date(2024, 0, 10).toISOString(),
        },
        {
            _id: "type_002",
            typeName: "Wholesale",
            typeDescription: "Bulk wholesale items",
            createdAt: new Date(2024, 0, 15).toISOString(),
        },
        {
            _id: "type_003",
            typeName: "Premium",
            typeDescription: "High-end premium products",
            createdAt: new Date(2024, 0, 20).toISOString(),
        },
        {
            _id: "type_004",
            typeName: "Economy",
            typeDescription: "Budget-friendly items",
            createdAt: new Date(2024, 1, 5).toISOString(),
        },
        {
            _id: "type_005",
            typeName: "Corporate",
            typeDescription: "Corporate and bulk orders",
            createdAt: new Date(2024, 1, 10).toISOString(),
        },
        {
            _id: "type_006",
            typeName: "Seasonal",
            typeDescription: "Seasonal and limited edition",
            createdAt: new Date(2024, 1, 15).toISOString(),
        },
        {
            _id: "type_007",
            typeName: "Import",
            typeDescription: "Imported goods",
            createdAt: new Date(2024, 2, 5).toISOString(),
        },
        {
            _id: "type_008",
            typeName: "Domestic",
            typeDescription: "Locally manufactured items",
            createdAt: new Date(2024, 2, 10).toISOString(),
        },
    ];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const fetchTypes = async () => {
        setIsLoading(true);
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500))
            
            dispatch(setTypeData(dummyTypesData));
        } catch (error) {
            console.log("fetching types Failed: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (data) => {
        // console.log(data);
        setIsButtonLoading(true)
        setError('')

        // console.log("Raw Data:", data);

        // Filter out empty string values
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "")
        );

        console.log("Cleaned Data:", cleanedData);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Create new type in dummy data
            const newType = {
                _id: `type_${Date.now()}`,
                ...cleanedData,
                createdAt: new Date().toISOString(),
            };
            dummyTypesData.push(newType);

            dispatch(setTypeData([...dummyTypesData]));
            setSuccessMessage("Type added successfully")
            setIsTypeCreated(true)
            reset()
        } catch (error) {
            console.log("error adding Type:", error)
            setError(error.message)
        } finally {
            setIsLoading(false)
            setIsButtonLoading(false)
        }
    };

    

    const handleEdit = (id, name) => {
        setTypeId(id)
        setIsEdit(true)
        setTypeName(name)
        // console.log(id)
    }

    const handleUpdateType = async (data) => {
        console.log(data);
        setIsButtonLoading(true)

        console.log("Raw Data:", data);

        // Filter out empty string values
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "")
        );

        console.log("Cleaned Data:", cleanedData);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Find and update the type in dummy data
            const typeIndex = dummyTypesData.findIndex(type => type._id === data.typeId);
            if (typeIndex !== -1) {
                dummyTypesData[typeIndex] = {
                    ...dummyTypesData[typeIndex],
                    ...cleanedData,
                };
            }

            dispatch(setTypeData([...dummyTypesData]));
            setSuccessMessage("Type updated successfully")
            setIsEdit(false)
            reset()
        } catch (error) {
            console.log("error updating Category:", error)
        } finally {
            setIsLoading(false)
            setIsTypeCreated(true)
            setIsButtonLoading(false)
        }
    };


    useEffect(() => {
        fetchTypes();
    }, [successMessage, isTypeCreated])

    return !isEdit ? (!isLoading ? (
        <div className='bg-white rounded-lg'>
            <div className='w-full flex items-center'>
                {isTypeCreated && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="bg-white p-6 rounded shadow-lg text-center relative">
                            <span className='absolute top-0 pt-1 right-2'>
                                <button className='hover:text-red-700'
                                    onClick={() => {
                                        setIsTypeCreated(false)
                                        setIsButtonLoading(false)
                                        setSuccessMessage('')
                                    }}>&#10008;</button>
                            </span>
                            <h2 className="text-lg font-thin p-4">{successMessage}</h2>
                        </div>
                    </div>
                )}
                <div className="w-full px-10  py-5 bg-white rounded shadow-lg">
                    <h2 className="text-lg text-center pt-2 font-semibold mb-2">Add Item Type</h2>

                    {/* Error Message Below the Heading */}
                    <div className="text-xs text-red-500 mb-2 text-center">
                        {error && <p>{error}</p>}
                        {errors.typeName && <p>Type Name is required.</p>}

                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                        <div className="space-y-2 text-xs">

                            <div className='flex justify-start gap-6'>
                                <div className="flex items-center">
                                    <label className="w-40">Type Name: <span className='text-red-500 pr-2'>*</span></label>
                                    <Input
                                        placeholder="Enter category name"
                                        {...register('typeName', { required: true })}
                                        divClass="flex  items-center"
                                        className="text-xs p-1 w-60 "
                                    />
                                </div>

                                <div className="flex items-center">
                                    <Input
                                        label="Description:"
                                        labelClass="w-20"
                                        divClass="flex  items-center"
                                        placeholder="Enter category description"
                                        {...register('typeDescription')}
                                        className="text-xs p-1 w-60 "
                                    />
                                </div>
                            </div>

                        </div>

                        <div className=" w-full flex justify-center">

                            <span
                                className="w-full flex justify-center pt-4"
                                disabled={isLoading}
                            >
                                {isButtonLoading ? (
                                    <div className="flex items-center gap-2">
                                        <span className="loader w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                                        Loading...
                                    </div>
                                ) : (
                                    <Button
                                        type="submit"
                                        className={`px-20 `}
                                    >Add Item Type</Button>

                                )}
                            </span>

                        </div>
                    </form>


                </div>
            </div>
            <h2 className="text-lg text-center font-semibold py-4">All Types</h2>
            {/* {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>} */}
            <div className="overflow-auto max-h-64 mb-4 scrollbar-thin rounded">
                <table className="min-w-full bg-white border text-xs">
                    <thead className="sticky -top-1 border-b shadow-sm bg-gray-300 z-10">
                        <tr>
                            <th className="py-2 px-1 text-left">S No.</th>
                            <th className="py-2 px-1 text-left">Type Name</th>
                            <th className="py-2 px-1 text-left">Type Description</th>
                            <th className="py-2 px-1 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {typeData && typeData?.map((type, index) => (
                            <tr key={index} className={`border-t hover:cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                <td className="py-1 px-2">{index + 1}</td>
                                <td className="py-1 px-2">{type.typeName}</td>
                                <td className="py-1 px-2">{type.typeDescription}</td>
                                <td className="py-1 px-2">
                                    <button
                                        className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-full"
                                        onClick={() => handleEdit(type._id, type.typeName)}
                                    >Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ) : <Loader message="Loading Data Please Wait...." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />)
        :
        <div className='w-full px-8 flex items-center'>
            {isTypeCreated && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded shadow-lg text-center relative">
                        <span className='absolute top-0 pt-1 right-2'>
                            <button className='hover:text-red-700' onClick={() => setIsTypeCreated(false)}>&#10008;</button>
                        </span>
                        <h2 className="text-lg font-thin p-4">{successMessage}</h2>
                    </div>
                </div>
            )}
            <div className="w-5/6 px-16 max-w-md mx-auto py-10 bg-white rounded shadow-lg">
                <span className='absolute right-80 mr-2 top-20'>
                    <button className='hover:text-red-700' onClick={() => setIsEdit(false)}>&#10008;</button>
                </span>
                <h2 className="text-lg text-center font-semibold">Update Category</h2>

                <form
                    onSubmit={handleSubmit(handleUpdateType)}
                    className='w-full'>
                    <div className="space-y-2 text-xs">
                        <h2 className='w-full text-center py-1'>{typeName}</h2>

                        <div className="flex items-center">
                            <input
                                type="hidden"
                                value={typeId}
                                {...register('typeId')}
                                className="border p-1 rounded w-full"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="w-40">Type Name: </label>
                            <input
                                type="text"
                                defaultValue={typeName}
                                {...register('typeName')}
                                className="border p-1 rounded w-full"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-40">Description:</label>
                            <input
                                type="text"
                                {...register('typeDescription')}
                                className="border p-1 rounded w-full"
                            />
                        </div>

                    </div>

                    <div className="mt-4 w-full flex justify-center">

                        <div
                            className="w-full flex justify-center pt-4"
                            disabled={isLoading}
                        >
                            {isButtonLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="loader w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                                    Loading...
                                </div>
                            ) : (
                                <Button
                                    type="submit"
                                    className={`px-24 `}
                                >Update Type</Button>

                            )}
                        </div>

                    </div>
                </form>
            </div>
        </div>


};

export default AddItemType;