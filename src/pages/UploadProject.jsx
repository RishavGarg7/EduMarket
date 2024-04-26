import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomButton, JobCard, JobTypes, TextInput } from "../components";
import { jobs } from "../utils/data";
import { useSelector } from "react-redux";
import { apiRequest,handleFileUpload } from "../utils";
import { Loading } from "../components"

const UploadJob = () => {
  const { user } = useSelector((state) => state.user)
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const [errMsg, setErrMsg] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [isLoading, setIsLoading] = useState(false)
  const [recentPost, setRecentPost] = useState([]);
  const [profileImage, setProfileImage] = useState("");

  const onSubmit = async (data) => {
    setIsLoading(true)
    setErrMsg(null)
    try {
      const uri = profileImage && (await handleFileUpload(profileImage));
      const newData = uri ? { ...data, img:uri, jobType: jobType } : { ...data, jobType: jobType };
      console.log(newData);
      const res = await apiRequest({
        url: "/jobs/upload-job",
        token: user?.token,
        data: newData,
        method: "POST"
      });

      if (res.status === "failed") {
        setErrMsg({ ...res });
      } else {
        setErrMsg({ status: "success", message: res.message })
        setTimeout(() => {
          window.location.reload();
        }, 2000)

      }
      setIsLoading(false)
    } catch (error) {
      console.log(error);
      setIsLoading(false)
    }

  };

  // const getRecentPost = async () => {
  //   try {
  //     const id = user?._id;

  //     const res = await apiRequest({
  //       url: "/companies/get-company/" + id,
  //       method: "GET",
  //     });
  //     setRecentPost(res?.data?.jobPosts);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   getRecentPost();
  // }, [])
  return (
    <div className="container mx-auto flex flex-cil md:flex-row gap-8 2xl:gap-14 bg-[#f7fdfd] px-5">
      <div className="w-full h-fit md:w-2/3 2xl:2/4 m-auto bg-white px-5 py-10 md:px-10 shadow-md">
        <div>
          <p className="text-gray-900 font-semibold text-2xl">Upload Project</p>

          <form
            className='w-full mt-2 flex flex-col gap-8'
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name='projectTitle'
              label='Project Title'
              placeholder='eg. Twitter Clone'
              type='text'
              required={true}
              register={register("projectTitle", {
                required: "Project Title is required",
              })}
              error={errors.projectTitle ? errors.projectTitle?.message : ""}
            />

            <div className='w-full flex gap-4'>
              {/* <div className={`w-1/2 mt-2`}>
                <label className='text-gray-600 text-sm mb-1'>Job Type</label>
                <JobTypes jobTitle={jobType} setJobTitle={setJobType} />
              </div> */}

              <div className='w-full'>
                <TextInput
                  name='sellingAmount'
                  label='Selling Amount (IND)'
                  placeholder='eg. 1500'
                  type='number'
                  register={register("sellingAmount", {
                    required: "Selling Amount is required",
                  })}
                  error={errors.sellingAmount ? errors.sellingAmount?.message : ""}
                />
              </div>
            </div>
            
            {/* <div className='w-full flex gap-4'>
              <div className='w-1/2'>
                <TextInput
                  name='vacancies'
                  label='No. of Vacancies'
                  placeholder='vacancies'
                  type='number'
                  register={register("vacancies", {
                    required: "Vacancies is required!",
                  })}
                  error={errors.vacancies ? errors.vacancies?.message : ""}
                />
              </div>

              <div className='w-1/2'>
                <TextInput
                  name='experience'
                  label='Years of Experience'
                  placeholder='experience'
                  type='number'
                  register={register("experience", {
                    required: "Experience is required",
                  })}
                  error={errors.experience ? errors.experience?.message : ""}
                />
              </div>
            </div> */}

            <TextInput
              name='tags'
              label='Tags or Keywods'
              placeholder='eg. Front-end'
              type='text'
              register={register("tags", {
                required: "Tags are required",
              })}
              error={errors.tags ? errors.tags?.message : ""}
            />
            <TextInput
              name='techMat'
              label='Tech Stuff Used'
              placeholder='eg. HTML, CSS, JS'
              type='text'
              register={register("techMat", {
                required: "Tech Stuff is required",
              })}
              error={errors.techMat ? errors.techMat?.message : ""}
            />
            <div className='flex flex-col'>
              <label className='text-gray-600 text-sm mb-1'>
                Project Description
              </label>
              <textarea
                className='rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none'
                rows={4}
                cols={6}
                {...register("desc", {
                  required: "Project Description is required!",
                })}
                aria-invalid={errors.desc ? "true" : "false"}
              ></textarea>
              {errors.desc && (
                <span role='alert' className='text-xs text-red-500 mt-0.5'>
                  {errors.desc?.message}
                </span>
              )}
            </div>

            <div className='flex flex-col'>
              <label className='text-gray-600 text-sm mb-1'>
                Project Thumbnail Image
              </label>
              <input
                name="img"
              {...register("img", {
                required: "Thumbnail Image is required!!",
              })}
                type='file'
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
              <img src={profileImage?URL.createObjectURL(profileImage):"null"} alt="" width={'80%'} className="m-auto mt-5 rounded-lg" />
              {errors.img && (
                <span role='alert' className='text-xs text-red-500 mt-0.5'>
                  {errors.img?.message}
                </span>
              )}
            </div>

            {errMsg && (
              <span role='alert' className='text-sm text-red-500 mt-0.5'>
                {errMsg}
              </span>
            )}
            <div className='mt-2'>
              {isLoading ? (
                <Loading />
              ) : (
                <CustomButton
                  type='submit'
                  containerStyles='inline-flex justify-center rounded-md border border-transparent bg-gray-900 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                  title='Submit'
                />)}
            </div>
          </form>
        </div>
      </div>
      {/* <div className='w-full md:w-1/3 2xl:2/4 p-5 mt-20 md:mt-0'>
        <p className='text-gray-500 font-semibold'>Recent Job Posts</p>

        <div className='w-full flex flex-wrap gap-6'>
          {recentPost.slice(0, 4).map((job, index) => {
            const data = {
              name:user?.name,
              email:user?.email,
              logo:user?.profileURL,
              ...job,
            }
            return <JobCard job={data} key={index} />;

          })}

        </div>
      </div> */}
    </div>
  )
}

export default UploadJob