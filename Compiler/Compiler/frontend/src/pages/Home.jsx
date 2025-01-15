import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Select from 'react-select';
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isEditModelShow, setIsEditModelShow] = useState(false);
  const [name, setName] = useState("");
  const [projects, setProjects] = useState(null);
  const [editProjId, setEditProjId] = useState("");

  const navigate = useNavigate();

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#000',
      borderColor: '#555',
      color: '#fff',
      padding: '5px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#000',
      color: '#fff',
      width: "100%"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#333' : '#000',
      color: '#fff',
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#aaa',
    }),
  };

  const getRunTimes = async () => {
    const res = await fetch("https://emkc.org/api/v2/piston/runtimes");
    const data = await res.json();
    const filteredLanguages = ["python", "javascript", "c", "c++", "java", "bash"];

    const options = data
      .filter(runtime => filteredLanguages.includes(runtime.language))
      .map(runtime => ({
        label: `${runtime.language} (${runtime.version})`,
        value: runtime.language === "c++" ? "cpp" : runtime.language,
        version: runtime.version,
      }));

    setLanguageOptions(options);
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
  };

  const getProjects = async () => {
    fetch(api_base_url + "/getProjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: localStorage.getItem("token") })
    }).then(res => res.json()).then(data => {
      if (data.success) setProjects(data.projects);
      else toast.error(data.msg);
    });
  };

  const createProj = () => {
    fetch(api_base_url + "/createProj", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        projLanguage: selectedLanguage.value,
        token: localStorage.getItem("token"),
        version: selectedLanguage.version
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setName("");
        navigate("/editior/" + data.projectId);
      } else toast.error(data.msg);
    });
  };

  const deleteProject = (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      fetch(api_base_url + "/deleteProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          token: localStorage.getItem("token")
        })
      }).then(res => res.json()).then(data => {
        if (data.success) getProjects();
        else toast.error(data.msg);
      });
    }
  };

  const updateProj = () => {
    fetch(api_base_url + "/editProject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: editProjId,
        token: localStorage.getItem("token"),
        name
      })
    }).then(res => res.json()).then(data => {
      setIsEditModelShow(false);
      setName("");
      setEditProjId("");
      getProjects();
    });
  };

  const handleCollabClick = () => {
    window.open("http://localhost:3001", "_blank");
  };

  useEffect(() => {
    getProjects();
    getRunTimes();
  }, []);

  return (
    <>
      <Navbar />

      {/* Header Buttons */}
      <div className="flex items-center px-[100px] justify-between mt-5">
        <h3 className='text-2xl'>👋 Hi, Coder's</h3>
        <div className="flex flex-col items-end gap-3">
          {/* Create Project Button */}
          <button onClick={() => setIsCreateModelShow(true)} className="btnNormal bg-blue-500 transition-all hover:bg-blue-600 px-4 py-2 rounded">
            Create Project
          </button>

          {/* Start Collaboration Button (Special Styling) */}
          <button
            onClick={handleCollabClick}
            className="animate-pulse border-2 border-purple-500 text-purple-500 font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 hover:text-white transition duration-300 shadow-lg"
          >
            🚀 Start Collaboration
          </button>
        </div>
      </div>

      {/* Project Cards */}
      <div className="projects px-[100px] mt-5 pb-10">
        {
          projects && projects.length > 0 ? projects.map((project, index) => (
            <div key={index} className="project w-full p-[15px] flex items-center justify-between bg-[#0f0e0e] rounded-lg mb-4 shadow-md">
              <div onClick={() => navigate("/editior/" + project._id)} className='flex w-full items-center gap-[15px] cursor-pointer'>
                <img className='w-[130px] h-[100px] object-cover' src={
                  project.projLanguage === "python" ? "https://images.ctfassets.net/em6l9zw4tzag/oVfiswjNH7DuCb7qGEBPK/b391db3a1d0d3290b96ce7f6aacb32b0/python.png" :
                    project.projLanguage === "javascript" ? "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" :
                      project.projLanguage === "cpp" ? "https://upload.wikimedia.org/wikipedia/commons/3/32/C%2B%2B_logo.png" :
                        project.projLanguage === "c" ? "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png" :
                          project.projLanguage === "java" ? "https://static-00.iconduck.com/assets.00/java-icon-1511x2048-6ikx8301.png" :
                            project.projLanguage === "bash" ? "https://w7.pngwing.com/pngs/48/567/png-transparent-bash-shell-script-command-line-interface-z-shell-shell-rectangle-logo-commandline-interface-thumbnail.png" :
                              ""
                } alt="" />
                <div>
                  <h3 className='text-xl'>{project.name}</h3>
                  <p className='text-[14px] text-[gray]'>{new Date(project.date).toDateString()}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button className="btnNormal bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded hover:from-purple-600 hover:to-pink-600 transition" onClick={() => navigate("/editior/" + project._id)}>Open Project</button>
                <div className="flex gap-2">
                  <button className="btnNormal bg-blue-500 hover:bg-blue-600 transition px-4 py-1 rounded" onClick={() => {
                    setIsEditModelShow(true);
                    setEditProjId(project._id);
                    setName(project.name);
                  }}>Edit</button>
                  <button className="btnNormal bg-red-500 hover:bg-red-600 transition px-4 py-1 rounded" onClick={() => deleteProject(project._id)}>Delete</button>
                </div>
              </div>
            </div>
          )) : <p className="text-center text-gray-400">No Project Found!</p>
        }
      </div>

      {/* Create Modal */}
      {isCreateModelShow &&
        <div onClick={(e) => {
          if (e.target.classList.contains("modelCon")) {
            setIsCreateModelShow(false);
            setName("");
          }
        }} className='modelCon fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.5)]'>
          <div className="modelBox bg-[#0F0E0E] w-[25vw] p-6 rounded-xl">
            <h3 className='text-xl font-bold mb-4'>Create Project</h3>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Project Name' className="text-black w-full mb-3 p-2 rounded" />
            <Select
              placeholder="Select Language"
              options={languageOptions}
              styles={customStyles}
              onChange={handleLanguageChange}
            />
            {selectedLanguage &&
              <>
                <p className="text-[14px] text-green-500 mt-2">Selected: {selectedLanguage.label}</p>
                <button onClick={createProj} className="btnNormal mt-3 bg-blue-500 hover:bg-blue-600 transition px-4 py-1 rounded">Create</button>
              </>
            }
          </div>
        </div>
      }

      {/* Edit Modal */}
      {isEditModelShow &&
        <div onClick={(e) => {
          if (e.target.classList.contains("modelCon")) {
            setIsEditModelShow(false);
            setName("");
          }
        }} className='modelCon fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.5)]'>
          <div className="modelBox bg-[#0F0E0E] w-[25vw] p-6 rounded-xl">
            <h3 className='text-xl font-bold mb-4'>Edit Project</h3>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Project Name' className="text-black w-full mb-3 p-2 rounded" />
            <button onClick={updateProj} className="btnNormal bg-blue-500 hover:bg-blue-600 transition px-4 py-1 rounded">Update</button>
          </div>
        </div>
      }
    </>
  );
};

export default Home;
