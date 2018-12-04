﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using BE;
using BL;

namespace UI
{

    class Program
    {


        static void Main(string[] args)
        {
           

                try
                {
                    BlImp bl = BL.FactoryBl.GetObject;
   

                    Tester t2 = new Tester("319185997", "Amnon", "Mayer", Gender.Male)
                    {
                        Address = new Address("jerusalem", "Hetzel", "1", "23"),
                        BirthDate = new DateTime(1937, 04, 17),
                        Email = "Amnon@g.jct.ac.il",
                        PhoneNumber = "089767006",
                        MaxDistance = 50,
                        MaxWeekExams = 40,
                        Experience = 6
                    };
                    t2.LicenseTypeTeaching.Add(LicenseType.A);
                    t2.LicenseTypeTeaching.Add(LicenseType._1);
                    bl.AddTester(t2);

                    Trainee t1 = new Trainee("319185989", Gender.Male, "Amnon", "Mayer")
                    {
                        Address = new Address("jerusalem", "Hetzel", "1", "23"),
                        BirthDate = new DateTime(1967, 04, 17),
                        Email = "Amnon@g.jct.ac.il",
                        PhoneNumber = "089767006",
                        TesterName = new Tester("319185997"),
                        SchoolName = "Gil",
                        NumberOfLessons = 50
                    };
                    t1.LicenseTypeLearning.Add(LicenseType.A);
                    t1.LicenseTypeLearning.Add(LicenseType._1);
                    bl.AddTrainee(t1);

                   

                    Test t = new Test("319185997","319185989")
                    {
                        Address = new Address("jerusalem"),
                        Date = new DateTime(1965, 08, 17),
                        ActualDateTime = new DateTime(1955, 08, 17),
                        Comment = "vs;smv;mv;vmsdvmsdvmsd;vlmsv;slmvs;vmsspvmoso[[jop",
                        RouteUrl = new Uri("Https://google.com"),
                        LicenseType = LicenseType.A,
                        Passed=true
                    };
                    t.Criterions.Add(new Criterion("Mirror", true));
                    Console.WriteLine("Add route to test......");
                    t.SetRouteAndAddressToTest(new Address("jerusalem"));
                    bl.AddTest(t);
                    Console.WriteLine("Export tests.....");
                    bl.AllTests.ToExcel();
                    Console.WriteLine("Export testers.....");
                    bl.AllTesters.ToExcel();
                    Console.WriteLine("Export trainees.....");
                    bl.AllTrainee.ToExcel();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message );
                    Console.ReadKey();
            }

            Console.ReadKey();

        }
    }
}
