using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BE.MainObjects;
using BE;
using BL;
using Newtonsoft.Json.Linq;
using BE.Routes;

namespace ReactUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TesterController : ControllerBase
    {
        private readonly BlImp bl = FactoryBl.GetObject;
        // GET: api/Tester
        [HttpGet]
        public IEnumerable<Tester> Get()
        {
         //   System.Threading.Thread.Sleep(3000);
            return bl.AllTesters;
        }

        // GET: api/Tester/5
        [HttpGet("{id}")]
        public Tester Get(int id)
        {
            return bl.AllTesters.FirstOrDefault((tester) => tester.Id == id);
        }

        // POST: api/Tester
        [HttpPost]
        public string Post([FromBody] Object val)
        {
            try
            {
                Tester tester = new Tester();
                var value = (Newtonsoft.Json.Linq.JObject)val;
                if (!BE.Tools.CheckID_IL(uint.Parse((String)value["id"])))
                    return "Invalid Id!";

                //   BL.FactoryBl.GetObject.AddTester(value);
                foreach (var prop in tester.GetType().GetProperties())
                {
                    if ((value[ToLower(prop.Name)]) is JArray)
                    {
                        var list = (value[ToLower(prop.Name)]).ToObject<List<BE.LicenseType>>();
                        prop.SetValue(tester, list);
                    }
                    else if (prop.Name == "Address")
                    {
                        prop.SetValue(tester, new Address((value[ToLower(prop.Name)].ToString())));
                    }
                    else if (prop.Name == "Schedule")
                    {
                        tester.Schedule = new WeekSchedule();
                        for (int day = 0; day < 5; day++)
                        {
                            for (int hour = 9; hour < 16; hour++)
                            {
                                try
                                {
                                    tester.Schedule.Days[day].Hours[hour] = (bool)value["schedule"]["days"][day]["hours"][hour];
                                }
                                catch (Exception ex) { }
                            }
                        }
                    }
                    else
                    {
                        try
                        {
                            prop.SetValue(tester, Convert.ChangeType((value[ToLower(prop.Name)]), prop.PropertyType));
                        }
                        catch (Exception ex) { };
                    }
                }
                tester.LicenseType = new List<LicenseType>();
          //      System.Threading.Thread.Sleep(2000);

                bl.AddTester(tester);
                return "OK";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

        // PUT: api/Tester
        [HttpPut()]
        public string Put([FromBody] Object val)
        {
            try
            {
                Tester tester = new Tester();
                var value = (Newtonsoft.Json.Linq.JObject)val;
                if (!BE.Tools.CheckID_IL(uint.Parse((String)value["id"])))
                    return "Invalid Id!";

                //   BL.FactoryBl.GetObject.AddTester(value);
                foreach (var prop in tester.GetType().GetProperties())
                {
                    if ((value[ToLower(prop.Name)]) is JArray)
                    {
                        var list = (value[ToLower(prop.Name)]).ToObject<List<BE.LicenseType>>();
                        prop.SetValue(tester, list);
                    }
                    else if (prop.Name == "Address")
                    {
                        prop.SetValue(tester, new Address((value[ToLower(prop.Name)].ToString())));
                    }
                    else if (prop.Name == "Schedule")
                    {
                        tester.Schedule = new WeekSchedule();
                        for (int day = 0; day < 5; day++)
                        {
                            for (int hour = 9; hour < 16; hour++)
                            {
                                tester.Schedule.Days[day].Hours[hour] = (bool)value["schedule"]["days"][day]["hours"][hour];
                            }
                        }
                    }
                    else
                    {
                        try
                        {
                            prop.SetValue(tester, Convert.ChangeType((value[ToLower(prop.Name)]), prop.PropertyType));
                        }
                        catch (Exception ex) { };
                    }
                }
                tester.LicenseType = new List<LicenseType>();
          //      System.Threading.Thread.Sleep(2000);

                bl.UpdateTester(tester);
                return "OK";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            try
            {
                Tester tester = new Tester();
                tester.Id = (uint)id;
                bl.RemoveTester(tester);
         //       System.Threading.Thread.Sleep(2000);
                return "OK";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        private string ToLower(string str)
        {
            if (str != string.Empty && char.IsUpper(str[0]))
            {
                return char.ToLower(str[0]) + str.Substring(1);
            }
            return "";
        }
    }
}
